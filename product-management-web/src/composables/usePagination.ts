import { computed } from "vue";
import { useRouter, useRoute } from "vue-router"
import type { IPaginatedResponse } from "@/types/pagination";
import { PAGE_SIZES } from "@/shared/constant";
import { useFetch } from "./useFetch";

export function usePagination<T>(endpoint: string) {
  const router = useRouter()
  const route = useRoute()

  const currentPageSize = computed(() => {
    // fallback to default when not provided.
    if (!route.query.pageSize) return "5"

    // fallback to default if not standard.
    try {
      const pageSize = Number(route.query.pageSize)
      if (Boolean(pageSize) && !PAGE_SIZES.includes(pageSize)) {
        throw new Error("pageSize is not standard!")
      } else {
        return route.query.pageSize
      }
    } catch {
      // fallback to default when exception raised.
      return "5"
    }
  })

  const searchQueries = computed(() => {
    const params = new URLSearchParams(route.query as Record<string, string>)

    // append default page when it's not included in params.
    if (!params.has("page")) {
      params.append("page", "1")
    }

    // normalized pageSize.
    params.set("pageSize", currentPageSize.value.toString())

    return params.toString()
  })

  const url = computed(() => 
    `${import.meta.env.VITE_BASE_API_URL}${endpoint}` + `?${searchQueries.value}`
  )

  const { data, error, loading } = useFetch<IPaginatedResponse>({
    url,
    method: 'GET',
  })

  const fetchNextPage = () => {
    if (!data.value?.pagination.totalPage) return
    if (data.value?.pagination.totalPage === data.value?.pagination.page) return

    router.push({
      query: {
        ...route.query,
        page: (data.value.pagination.page + 1).toString(),
      },
    })
  }

  const fetchPrevPage = () => {
    if (!data.value?.pagination.page) return
    if (data.value.pagination.page <= 1) return

    router.push({
      query: {
        ...route.query,
        page: (data.value.pagination.page - 1).toString(),
      },
    })
  }

  const changePageSize = (newPageSize: number) => {
    if (!newPageSize) return

    router.push({
      query: {
        ...route.query,
        pageSize: newPageSize.toString(),
      },
    })
  }

  return {
    data: data as T,
    error,
    loading,
    currentPageSize,
    fetchNextPage,
    fetchPrevPage,
    changePageSize
  }
}
