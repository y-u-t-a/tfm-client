import type { LocationQuery, LocationQueryRaw } from 'vue-router'

/**
 * 検索条件のオブジェクトを、URL のクエリと双方向に同期する。
 * URL が変わると form に反映し、form が変わると URL に反映する
 */
export function useQueryForm<T extends object>(options: {
  fromQuery: (query: LocationQuery) => T
  toQuery: (form: T) => LocationQueryRaw
}) {
  const route = useRoute()
  const router = useRouter()

  const form = reactive(options.fromQuery(route.query)) as T

  watch(() => route.query, (query) => {
    Object.assign(form, options.fromQuery(query))
  })

  watch(() => options.toQuery(form), (query) => {
    router.push({ query })
  }, { deep: true })

  return form
}
