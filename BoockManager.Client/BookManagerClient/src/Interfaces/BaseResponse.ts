export interface Pagination {
  currentPage: number; // Cambiado a minúscula
  totalPages: number | null;
  previousPage: number | null;
  nextPage: number | null;
  totalCount: number | null;
  pageSize: number | null;
}

export interface BaseResponse<T> {
  statusCode: number;    
  message: string;      
  details: T;            
  pagination?: Pagination | null;
}