export interface IPaginatedResponse {
  pagination: {
    page: number
    pageSize: number
    totalPage: number
    totalItems: number
  }
}
