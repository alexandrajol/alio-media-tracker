const prisma = require('../config/prismaClient');

const parseOptionalInt = (value) => {
  if (value === undefined || value === null || value === '') return undefined;
  const parsed = parseInt(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const getDefaultStatus = (type) => (type === 'Book' ? 'Unread' : 'Unwatched');
const getCompletedStatus = (type) => (type === 'Book' ? 'Read' : 'Watched');
const getIncompleteStatus = (type) => (type === 'Book' ? 'Unread' : 'Unwatched');

const formatMedia = (media) => {
  const type = media.category.name;
  const userStatus = media.userStatuses?.[0]?.status || getDefaultStatus(type);
  const { category, userStatuses, ...flatMedia } = media;

  return {
    ...flatMedia,
    type,
    userStatus,
    isCompleted: userStatus === getCompletedStatus(type)
  };
};

// 1. CREATE
async function addMedia(data, userId) {
  // Ensure a default user exists
  let user = userId ? await prisma.user.findUnique({ where: { id: userId } }) : await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({ data: { email: 'test@alio.com', username: 'AlioUser' }});
  }

  // Find or create the Category 
  let category = await prisma.category.findUnique({ where: { name: data.type } });
  if (!category) {
    category = await prisma.category.create({ data: { name: data.type } });
  }

  // Create the actual media item (WITH SANITIZED DATA)
  const createdMedia = await prisma.media.create({
    data: {
      title: data.title,
      genre: data.genre || undefined,
      year: parseOptionalInt(data.year),
      rating: parseOptionalInt(data.rating),
      review: data.review || undefined,
      posterUrl: data.posterUrl?.trim() || undefined,
      director: data.director || undefined,
      duration: data.duration || undefined,
      
      // The Magic Fix: If they are blank, send 'undefined' instead of an empty string!
      seasons: parseOptionalInt(data.seasons),
      author: data.author || undefined,
      pages: parseOptionalInt(data.pages),
      
      userId: user.id,
      categoryId: category.id
    },
    include: { category: true } 
  });

  return formatMedia({ ...createdMedia, userStatuses: [] });
}

// 2. READ (Async fetch and format for React)
async function getMedia(filters, userId) {
  const page = Math.max(parseInt(filters.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(filters.limit) || 100, 1), 100);
  const where = {};

  if (filters.type) {
    where.category = { name: filters.type };
  }

  if (filters.genre) {
    where.genre = { contains: filters.genre };
  }

  if (filters.search) {
    where.title = { contains: filters.search };
  }

  if (filters.creator) {
    where.OR = [
      { author: { contains: filters.creator } },
      { director: { contains: filters.creator } }
    ];
  }

  const year = parseOptionalInt(filters.year);
  const yearFrom = parseOptionalInt(filters.yearFrom);
  const yearTo = parseOptionalInt(filters.yearTo);
  if (year) {
    where.year = year;
  } else if (yearFrom || yearTo) {
    where.year = {};
    if (yearFrom) where.year.gte = yearFrom;
    if (yearTo) where.year.lte = yearTo;
  }

  const rating = parseOptionalInt(filters.rating);
  const minRating = parseOptionalInt(filters.minRating);
  const maxRating = parseOptionalInt(filters.maxRating);
  if (rating) {
    where.rating = rating;
  } else if (minRating || maxRating) {
    where.rating = {};
    if (minRating) where.rating.gte = minRating;
    if (maxRating) where.rating.lte = maxRating;
  }

  const hasStatusFilter = filters.status === 'completed' || filters.status === 'incomplete';

  const medias = await prisma.media.findMany({
    where,
    include: {
      category: true,
      userStatuses: {
        where: { userId },
        take: 1
      }
    },
    skip: hasStatusFilter ? undefined : (page - 1) * limit,
    take: hasStatusFilter ? undefined : limit,
    orderBy: { id: 'asc' }
  });
  
  // Map the relational data back to the flat format React expects
  const formattedMedia = medias.map(formatMedia);
  const statusFilteredMedia = hasStatusFilter
    ? formattedMedia.filter((item) => filters.status === 'completed' ? item.isCompleted : !item.isCompleted)
    : formattedMedia;

  return hasStatusFilter
    ? statusFilteredMedia.slice((page - 1) * limit, page * limit)
    : statusFilteredMedia;
}

async function getMediaById(id, userId) {
  const media = await prisma.media.findUnique({
    where: { id: parseInt(id) },
    include: {
      category: true,
      userStatuses: {
        where: { userId },
        take: 1
      }
    }
  });

  if (!media) return null;

  return formatMedia(media);
}

// 3. UPDATE
async function updateMedia(id, data, userId) {
  const updateData = {};

  [
    'title', 'genre', 'year', 'rating', 'review', 'posterUrl',
    'director', 'duration', 'seasons', 'author', 'pages'
  ].forEach((field) => {
    if (data[field] !== undefined) updateData[field] = data[field];
  });

  ['year', 'rating', 'seasons', 'pages'].forEach((field) => {
    if (updateData[field] !== undefined && updateData[field] !== null && updateData[field] !== '') {
      updateData[field] = parseOptionalInt(updateData[field]);
    }
  });

  if (updateData.posterUrl !== undefined) {
    updateData.posterUrl = updateData.posterUrl?.trim() || null;
  }

  const updatedMedia = await prisma.media.update({
    where: { id: parseInt(id) },
    data: updateData,
    include: {
      category: true,
      userStatuses: {
        where: { userId },
        take: 1
      }
    }
  });

  return formatMedia(updatedMedia);
}

async function updateMediaStatus(id, userId, data) {
  const media = await prisma.media.findUnique({
    where: { id: parseInt(id) },
    include: { category: true }
  });

  if (!media) return null;

  const type = media.category.name;
  const status = typeof data.status === 'string'
    ? data.status
    : (data.isCompleted ? getCompletedStatus(type) : getIncompleteStatus(type));

  const allowedStatuses = [getCompletedStatus(type), getIncompleteStatus(type)];
  if (!allowedStatuses.includes(status)) {
    throw new Error(`Status must be ${allowedStatuses.join(' or ')}`);
  }

  const savedStatus = await prisma.userMediaStatus.upsert({
    where: {
      userId_mediaId: {
        userId,
        mediaId: media.id
      }
    },
    update: { status },
    create: {
      userId,
      mediaId: media.id,
      status
    }
  });

  return formatMedia({ ...media, userStatuses: [savedStatus] });
}

// 4. DELETE
async function deleteMedia(id) {
  return await prisma.media.delete({
    where: { id: parseInt(id) }
  });
}

// 5. STATISTICS
async function getStatistics(type, userId) {
  const where = type ? { category: { name: type } } : {};
  const medias = await prisma.media.findMany({
    where,
    include: {
      category: true,
      userStatuses: userId ? {
        where: { userId },
        take: 1
      } : false
    },
    orderBy: { id: 'asc' }
  });

  const ratingCounts = {
    '5 Stars': 0,
    '4 Stars': 0,
    '3 Stars': 0,
    '2 Stars': 0,
    '1 Star': 0
  };
  const decades = {};
  const genres = {};
  const statusStats = {
    completed: 0,
    incomplete: 0
  };

  medias.forEach((item) => {
    const formattedItem = formatMedia(item);

    if (item.rating >= 1 && item.rating <= 5) {
      const label = item.rating === 1 ? '1 Star' : `${item.rating} Stars`;
      ratingCounts[label] += 1;
    }

    if (item.year) {
      const decade = `${Math.floor(item.year / 10) * 10}s`;
      decades[decade] = (decades[decade] || 0) + 1;
    }

    const genre = item.genre || 'Uncategorized';
    genres[genre] = (genres[genre] || 0) + 1;

    if (formattedItem.isCompleted) statusStats.completed += 1;
    else statusStats.incomplete += 1;
  });

  const ratedItems = medias.filter((item) => item.rating);
  const averageRating = ratedItems.length
    ? ratedItems.reduce((sum, item) => sum + item.rating, 0) / ratedItems.length
    : 0;

  return {
    totalCount: medias.length,
    averageRating,
    ratingStats: Object.entries(ratingCounts)
      .filter(([, value]) => value > 0)
      .map(([name, value]) => ({ name, value })),
    decadeStats: Object.entries(decades)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, count]) => ({ name, count })),
    genreStats: Object.entries(genres)
      .map(([name, value]) => ({ name, value })),
    statusStats: [
      { name: type === 'Book' ? 'Read' : 'Watched', value: statusStats.completed },
      { name: type === 'Book' ? 'Unread' : 'Unwatched', value: statusStats.incomplete }
    ].filter((item) => item.value > 0)
  };
}

module.exports = { addMedia, getMedia, getMediaById, updateMedia, updateMediaStatus, deleteMedia, getStatistics };
