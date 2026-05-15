const { PrismaClient } = require('../generated/client/index.js');

// 1. CREATE
async function addMedia(data) {
  return await prisma.media.create({
    data: {
      title: data.title,
      status: data.status,
      rating: data.rating,
      userId: data.userId,
      categoryId: data.categoryId
    }
  });
}

// 2. READ (With Filters)
async function getMedia(filters) {
  return await prisma.media.findMany({
    where: {
      // Example Filter: Only show media with a specific status
      status: filters.status || undefined,
      categoryId: filters.categoryId ? parseInt(filters.categoryId) : undefined
    },
    include: { category: true } // Joins the category table
  });
}

// 3. UPDATE
async function updateMedia(id, data) {
  return await prisma.media.update({
    where: { id: parseInt(id) },
    data: data
  });
}

// 4. DELETE
async function deleteMedia(id) {
  return await prisma.media.delete({
    where: { id: parseInt(id) }
  });
}

// 5. STATISTICS
async function getMediaStats(userId) {
  // Aggregate data: average rating and total counts
  const stats = await prisma.media.aggregate({
    where: { userId: parseInt(userId) },
    _avg: { rating: true },
    _count: { id: true }
  });

  // Group by: count how many items per status (e.g., 5 'Completed', 2 'Plan to Watch')
  const statusCounts = await prisma.media.groupBy({
    by: ['status'],
    where: { userId: parseInt(userId) },
    _count: { status: true }
  });

  return { stats, statusCounts };
}

module.exports = { addMedia, getMedia, updateMedia, deleteMedia, getMediaStats };







// // src/services/mediaService.js
// let mediaItems = [
//     { id: 1, title: 'Dirty Dancing', type: 'Movie', director: 'Emile Ardolino', year: 1987, duration: '1h 40m', rating: 5, watched: '10.10.2020', review: 'Dirty Dancing is a classic film that is so memorable that it is hard to say anything negative about it...', genre: 'Romance', posterUrl: 'https://s3.amazonaws.com/nightjarprod/content/uploads/sites/130/2022/01/19173426/dvEggyDTTIBDvrUNjTEa9depT0f-scaled.jpg' },
//     { id: 2, title: 'The Boss Baby', type: 'Movie', director: 'Tom McGrath', year: 2017, duration: '1h 37m', rating: 4, watched: '12.05.2021', review: 'A surprisingly funny family movie.', genre: 'Animation', posterUrl: 'https://m.media-amazon.com/images/M/MV5BMTg5MzUxNzgxNV5BMl5BanBnXkFtZTgwMTM2NzQ3MjI@._V1_.jpg' },
//     { id: 3, title: 'Harry Potter and the Sorcerer\'s Stone', type: 'Movie', director: 'Chris Columbus', year: 2001, duration: '2h 32m', rating: 5, watched: '15.01.2022', review: 'The one that started the magic.', genre: 'Fantasy', posterUrl: 'https://media.harrypotterfanzone.com/philosophers-stone-theatrical-poster-709x0-c-default.jpg' },
//     { id: 4, title: 'Harry Potter and the Chamber of Secrets', type: 'Movie', director: 'Chris Columbus', year: 2002, duration: '2h 41m', rating: 4, watched: '16.01.2022', review: 'A great continuation of the story.', genre: 'Fantasy', posterUrl: 'https://media.harrypotterfanzone.com/chamber-of-secrets-theatrical-poster-600x0-c-default.jpg' },
//     { id: 5, title: 'Harry Potter and the Prisoner of Azkaban', type: 'Movie', director: 'Alfonso Cuarón', year: 2004, duration: '2h 22m', rating: 5, watched: '17.01.2022', review: 'Visually stunning and darker tone.', genre: 'Fantasy', posterUrl: 'https://media.harrypotterfanzone.com/prisoner-of-azkaban-theatrical-poster-2-568x0-c-default.jpg' },
//     { id: 6, title: 'Harry Potter and the Goblet of Fire', type: 'Movie', director: 'Mike Newell', year: 2005, duration: '2h 37m', rating: 4, watched: '18.01.2022', review: 'The Triwizard Tournament was epic.', genre: 'Fantasy', posterUrl: 'https://media.harrypotterfanzone.com/goblet-of-fire-theatrical-poster-600x0-c-default.jpg' },
//     { id: 7, title: 'Harry Potter and the Order of the Phoenix', type: 'Movie', director: 'David Yates', year: 2007, duration: '2h 18m', rating: 4, watched: '19.01.2022', review: 'Dumbledore\'s Army unites.', genre: 'Fantasy', posterUrl: 'https://media.harrypotterfanzone.com/order-of-the-phoenix-theatrical-poster-3-700x0-c-default.jpg' },
//     { id: 8, title: 'Harry Potter and the Half-Blood Prince', type: 'Movie', director: 'David Yates', year: 2009, duration: '2h 33m', rating: 4, watched: '20.01.2022', review: 'Discovering Voldemort\'s past.', genre: 'Fantasy', posterUrl: 'https://media.harrypotterfanzone.com/half-blood-prince-theatrical-poster-600x0-c-default.jpg' },
//     { id: 9, title: 'Harry Potter and the Deathly Hallows: Part 1', type: 'Movie', director: 'David Yates', year: 2010, duration: '2h 26m', rating: 4, watched: '21.01.2022', review: 'The beginning of the end.', genre: 'Fantasy', posterUrl: 'https://media.harrypotterfanzone.com/deathly-hallows-part-1-theatrical-poster-600x0-c-default.jpg' },
//     { id: 10, title: 'Harry Potter and the Deathly Hallows: Part 2', type: 'Movie', director: 'David Yates', year: 2011, duration: '2h 10m', rating: 4, watched: '21.01.2022', review: 'It all ends.', genre: 'Fantasy', posterUrl: 'https://media.harrypotterfanzone.com/deathly-hallows-part-2-it-all-ends-poster-600x0-c-default.jpg' },
//     { id: 11, title: 'Benny & Joon', type: 'Movie', director: 'Jeremiah S. Chechik', year: 1993, duration: '1h 38m', rating: 4, watched: '05.08.2023', review: 'A quirky and charming romance.', genre: 'Romance', posterUrl: 'https://m.media-amazon.com/images/S/pv-target-images/de731502a46d7aa3c689ca73598a34121789a9cb852cc9e06b00528c88599268.jpg' },
//     { id: 12, title: 'The Devil Wears Prada', type: 'Movie', director: 'David Frankel', year: 2006, duration: '1h 49m', rating: 5, watched: '11.11.2023', review: 'An absolutely iconic performance by Meryl Streep.', genre: 'Comedy', posterUrl: 'https://m.media-amazon.com/images/M/MV5BOWM3NTI3YWEtYjJmMy00M2U5LWI1NzEtZWM3ZDY2ZWNjOGRiXkEyXkFqcGc@._V1_.jpg' },
//     { id: 13, title: 'Dune', type: 'Book', author: 'Frank Herbert', year: 1965, pages: 412, rating: 5, watched: '01.03.2023', review: 'A masterpiece of science fiction.', genre: 'Science-Fiction', posterUrl: 'https://m.media-amazon.com/images/I/81Ua99CURsL._AC_UF1000,1000_QL80_.jpg' },
//     { id: 14, title: '1984', type: 'Book', author: 'George Orwell', year: 1949, pages: 328, rating: 5, watched: '15.04.2023', review: 'Chilling and prophetic.', genre: 'Dystopian', posterUrl: 'https://m.media-amazon.com/images/I/71wANojhEKL._AC_UF1000,1000_QL80_.jpg' },
//     { id: 15, title: 'Breaking Bad', type: 'TV Show', director: 'Vince Gilligan', year: 2008, seasons: 5, rating: 5, watched: '10.05.2021', review: 'The greatest character arc in television history.', genre: 'Crime', posterUrl: 'https://m.media-amazon.com/images/M/MV5BMzU5ZGYzNmQtMTdhYy00OGRiLTg0NmQtYjVjNzliZTg1ZGE4XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg' },
//     { id: 16, title: 'The Office', type: 'TV Show', director: 'Greg Daniels', year: 2005, seasons: 9, rating: 4, watched: '10.10.2012', review: 'My comfort show.', genre: 'Sitcom', posterUrl: 'https://m.media-amazon.com/images/M/MV5BZjQwYzBlYzUtZjhhOS00ZDQ0LWE0NzAtYTk4MjgzZTNkZWEzXkEyXkFqcGc@._V1_QL75_UX190_CR0,2,190,281_.jpg' },
//     { id: 17, title: 'The Office', type: 'TV Show', director: 'Greg Daniels', year: 2005, seasons: 9, rating: 4, watched: '10.10.2012', review: 'My comfort show.', genre: 'Sitcom', posterUrl: 'https://m.media-amazon.com/images/M/MV5BZjQwYzBlYzUtZjhhOS00ZDQ0LWE0NzAtYTk4MjgzZTNkZWEzXkEyXkFqcGc@._V1_QL75_UX190_CR0,2,190,281_.jpg' }
// ];

// let currentId = 18;

// module.exports = {
//     // Pagination Implementation
//     getAll: (page = 1, limit = 10) => {
//         const startIndex = (page - 1) * limit;
//         const endIndex = startIndex + parseInt(limit);
        
//         return {
//             totalItems: mediaItems.length,
//             totalPages: Math.ceil(mediaItems.length / limit),
//             currentPage: parseInt(page),
//             data: mediaItems.slice(startIndex, endIndex)
//         };
//     },
    
//     getById: (id) => mediaItems.find(item => item.id === parseInt(id)),
    
//     create: (data) => {
//         const newItem = { id: currentId++, ...data };
//         mediaItems.push(newItem);
//         return newItem;
//     },
    
//     update: (id, data) => {
//         const index = mediaItems.findIndex(item => item.id === parseInt(id));
//         if (index === -1) return null;
//         mediaItems[index] = { ...mediaItems[index], ...data };
//         return mediaItems[index];
//     },
    
//     delete: (id) => {
//         const index = mediaItems.findIndex(item => item.id === parseInt(id));
//         if (index === -1) return false;
//         mediaItems.splice(index, 1);
//         return true;
//     },

//     // Replace the old getStatistics at the bottom of mediaService.js with this:
//     getStatistics: (type) => {
//         // Filter by type if a type is provided
//         const data = type ? mediaItems.filter(item => item.type === type) : mediaItems;

//         const ratingCounts = { '5 Stars': 0, '4 Stars': 0, '3 Stars': 0, '2 Stars': 0, '1 Star': 0 };
//         const decades = {};
//         const genres = {};
//         const lengthStats = [];

//         data.forEach(item => {
//             // 1. Ratings
//             if (item.rating === 5) ratingCounts['5 Stars']++;
//             else if (item.rating === 4) ratingCounts['4 Stars']++;
//             else if (item.rating === 3) ratingCounts['3 Stars']++;
//             else if (item.rating === 2) ratingCounts['2 Stars']++;
//             else if (item.rating === 1) ratingCounts['1 Star']++;

//             // 2. Decades
//             if (item.year) {
//                 const decade = Math.floor(item.year / 10) * 10 + 's';
//                 decades[decade] = (decades[decade] || 0) + 1;
//             }

//             // 3. Genres
//             const g = item.genre || 'Uncategorized';
//             genres[g] = (genres[g] || 0) + 1;

//             // 4. Lengths
//             let lengthVal = 0;
//             if (item.type === 'Movie' && item.duration) {
//                 const hMatch = item.duration.match(/(\d+)h/);
//                 const mMatch = item.duration.match(/(\d+)m/);
//                 if (hMatch) lengthVal += parseInt(hMatch[1]) * 60;
//                 if (mMatch) lengthVal += (mMatch[1] ? parseInt(mMatch[1]) : 0);
//             } else if (item.type === 'Book' && item.pages) {
//                 lengthVal = item.pages;
//             } else if (item.type === 'TV Show' && item.seasons) {
//                 lengthVal = item.seasons;
//             }
            
//             lengthStats.push({ 
//                 name: item.title.length > 15 ? item.title.substring(0, 15) + '...' : item.title, 
//                 length: lengthVal,
//                 fullTitle: item.title
//             });
//         });

//         // Format data perfectly for Recharts
//         return {
//             totalCount: data.length,
//             ratingStats: Object.keys(ratingCounts).filter(k => ratingCounts[k] > 0).map(k => ({ name: k, value: ratingCounts[k] })),
//             decadeStats: Object.keys(decades).sort().map(k => ({ name: k, count: decades[k] })),
//             genreStats: Object.keys(genres).map(k => ({ name: k, value: genres[k] })),
//             lengthStats
//         };
//     }
// };