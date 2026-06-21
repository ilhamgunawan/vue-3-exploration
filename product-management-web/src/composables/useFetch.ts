import { ref, watchEffect, toValue, type ComputedRef } from 'vue';

type UseFetchOptions = {
  url: ComputedRef<string>
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE' | 'OPTION'
}

export function useFetch<T>(options: UseFetchOptions) {
  const { url, method } = options;

  const data = ref<T | null>(null)
  const error = ref(null)
  const loading = ref(true)

  const fetchData = () => {
    // reset state before fetching..
    data.value = null
    error.value = null
    loading.value = true

    fetch(toValue(url), { method: toValue(method) })
      .then((res) => res.json())
      .then((json) => {
        data.value = json
      })
      .catch((err) => {
        error.value = err
      })
      .finally(() => {
        loading.value = false
      })
  }

  watchEffect(() => {
    fetchData()
  })

  return { data, error, loading }
}
