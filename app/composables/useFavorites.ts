/**
 * お気に入りの番組 ID。ブラウザの localStorage に保存する
 */
export function useFavoritePrograms() {
  const { state: favoritePrograms, save } = useStoredState<string[]>('favoriteProgramIds', [])

  function isFavorite(programId: string) {
    return favoritePrograms.value.includes(programId)
  }

  function toggleFavorite(programId: string) {
    save(
      isFavorite(programId)
        ? favoritePrograms.value.filter(id => id !== programId)
        : [...favoritePrograms.value, programId],
    )
  }

  return { isFavorite, toggleFavorite }
}

/**
 * 番組内のお気に入りのエピソード ID。ブラウザの localStorage に番組 ID ごとにまとめて保存する
 */
export function useFavoriteEpisodes(programId: string) {
  const { state: favoriteIds, save } = useStoredState<Record<string, string[]>>('favoriteEpisodeIds', {})

  function isFavorite(episodeId: string) {
    return favoriteIds.value[programId]?.includes(episodeId) ?? false
  }

  function toggleFavorite(episodeId: string) {
    const ids = favoriteIds.value[programId] ?? []
    const nextIds = isFavorite(episodeId) ? ids.filter(id => id !== episodeId) : [...ids, episodeId]
    save({ ...favoriteIds.value, [programId]: nextIds })
  }

  return { isFavorite, toggleFavorite }
}

/**
 * ブラウザの localStorage に JSON で保存する値。変更は save で行う
 */
function useStoredState<T extends object>(storageKey: string, defaultValue: T) {
  const state = useState<T>(storageKey, () => {
    // 別のタブで登録・解除した内容も反映する。反映しないと古い一覧のまま保存して上書きしてしまう
    window.addEventListener('storage', (e) => {
      if (e.key === storageKey) {
        state.value = load()
      }
    })
    return load()
  })

  function load(): T {
    try {
      const value = JSON.parse(localStorage.getItem(storageKey) ?? 'null')
      // 配列とオブジェクトの取り違えなど、想定と異なる形の値が保存されていたら初期値を使う
      return typeof value === 'object' && value !== null && Array.isArray(value) === Array.isArray(defaultValue)
        ? value
        : defaultValue
    } catch {
      return defaultValue
    }
  }

  function save(value: T) {
    state.value = value
    localStorage.setItem(storageKey, JSON.stringify(value))
  }

  return { state, save }
}
