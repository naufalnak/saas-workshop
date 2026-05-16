// src/lib/pagination.ts
export const DEFAULT_PAGE_SIZE = 20;

export function getPaginationParams(
  page: number = 1,
  pageSize: number = DEFAULT_PAGE_SIZE,
) {
  return {
    skip: (page - 1) * pageSize,
    take: pageSize,
  };
}

export function getPaginationMeta(
  total: number,
  page: number,
  pageSize: number,
) {
  return {
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
    hasNext: page * pageSize < total,
    hasPrev: page > 1,
  };
}
