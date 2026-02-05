export type PaginationType<T> = {
    page: number;
    totalPages: number;
    totalResults: number;
    result: T[];
};
