import type { IPaginatedResponse } from "@/types/pagination"

export type ProductStatus = 'active' | 'inactive' | 'deleted'

export interface IProduct {
  id: number
  name: string
  status: ProductStatus
  created_at: string
  updated_at: string | null
}

export interface IProductsResponse extends IPaginatedResponse {
  products: IProduct[]
}
