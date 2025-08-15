export function buildPaginatedResponse(paginated, baseUrl, originalQuery = {}) {
  const {
    docs,
    totalPages,
    page,
    prevPage,
    nextPage,
    hasPrevPage,
    hasNextPage,
  } = paginated;
  const mkLink = (targetPage) => {
    if (!targetPage) return null;
    const q = new URLSearchParams({
      ...originalQuery,
      page: String(targetPage),
    });
    return `${baseUrl}?${q.toString()}`;
  };
  return {
    status: "success",
    payload: docs,
    totalPages,
    prevPage,
    nextPage,
    page,
    hasPrevPage,
    hasNextPage,
    prevLink: hasPrevPage ? mkLink(prevPage) : null,
    nextLink: hasNextPage ? mkLink(nextPage) : null,
  };
}
