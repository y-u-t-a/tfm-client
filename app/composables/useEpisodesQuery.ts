/**
 * エピソード一覧の絞り込み条件。URL のクエリと同期する
 */
export function useEpisodesQuery() {
  return useQueryForm({
    fromQuery: query => ({
      q: (query.q as string) || '',
      favorite: query.favorite === '1',
      // 存在しない日付などが URL に書かれていた場合は、未指定として扱う
      from: parseDateString(query.from),
      to: parseDateString(query.to),
    }),
    toQuery: form => ({
      q: form.q || undefined,
      favorite: form.favorite ? '1' : undefined,
      from: form.from?.toString(),
      to: form.to?.toString(),
    }),
  })
}
