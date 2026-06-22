import { ref, watchEffect, toValue, type ComputedRef } from 'vue';

type UseFetchOptions = {
  url: ComputedRef<string>
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE' | 'OPTION'
  enabled?: boolean
}

type FetchDataOptions = {
  body?: Record<string, any>
  headers?: Record<string, string>
  onSuccess?: (data: any) => void
}

export function useFetch<T>(options: UseFetchOptions) {
  const { url, method, enabled = true } = options;

  const data = ref<T | null>(null)
  const error = ref(null)
  const loading = ref(true)

  const fetchData = async (options?: FetchDataOptions) => {
    // reset state before fetching..
    data.value = null
    error.value = null
    loading.value = true

    try {
      const res = await fetch(toValue(url), { 
        method: toValue(method),
        body: options?.body ? JSON.stringify(options.body) : undefined,
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const json = await res.json()
      data.value = json

      if (res.ok) {
        options?.onSuccess?.(json)
      } else {
        error.value = json?.title || res.statusText
      }
    } catch(err) {
      error.value = err as any
    } finally {
      loading.value = false
    }
  }

  watchEffect(() => {
    if (toValue(enabled)) {
      fetchData()
    }
  })

  return { data, error, loading, fetchData }
}
