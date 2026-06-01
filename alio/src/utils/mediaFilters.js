export const emptyMediaFilters = {
  search: '',
  creator: '',
  genre: '',
  minRating: '',
  status: '',
  yearFrom: '',
  yearTo: '',
};

export const applyMediaFilters = (items, filters) => {
  const search = filters.search.trim().toLowerCase();
  const creator = filters.creator.trim().toLowerCase();
  const genre = filters.genre.trim().toLowerCase();
  const minRating = filters.minRating ? Number(filters.minRating) : null;
  const status = filters.status;
  const yearFrom = filters.yearFrom ? Number(filters.yearFrom) : null;
  const yearTo = filters.yearTo ? Number(filters.yearTo) : null;

  return items.filter((item) => {
    if (search && !item.title?.toLowerCase().includes(search)) return false;
    if (
      creator &&
      !item.author?.toLowerCase().includes(creator) &&
      !item.director?.toLowerCase().includes(creator)
    ) {
      return false;
    }
    if (genre && item.genre?.toLowerCase() !== genre) return false;
    if (minRating && Number(item.rating || 0) < minRating) return false;
    if (status === 'completed' && !item.isCompleted) return false;
    if (status === 'incomplete' && item.isCompleted) return false;
    if (yearFrom && Number(item.year || 0) < yearFrom) return false;
    if (yearTo && Number(item.year || 0) > yearTo) return false;

    return true;
  });
};
