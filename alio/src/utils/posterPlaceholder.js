export const getPosterUrl = (item) => {
  const title = item?.title || 'Untitled';
  const type = item?.type || 'Media';
  const placeholderUrl = `https://placehold.co/300x450/2b3035/ffffff?text=${encodeURIComponent(`${type}: ${title}`)}`;
  const posterUrl = item?.posterUrl?.trim();

  if (!posterUrl) {
    return placeholderUrl;
  }

  if (posterUrl.includes('placehold.co/300x450')) {
    return placeholderUrl;
  }

  return posterUrl;
};
