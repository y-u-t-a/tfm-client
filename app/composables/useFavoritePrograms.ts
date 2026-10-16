const STORAGE_KEY = 'favoriteProgramIds'

/**
 * お気に入りの番組 ID。ブラウザの localStorage に保存する
 */
export function useFavoritePrograms() {
  const favoriteIds = useState<string[]>('favoriteProgramIds', () => {
    // 別のタブで登録・解除した内容も反映する。反映しないと古い一覧のまま保存して上書きしてしまう
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY) favoriteIds.value = load()
    })
    return load()
  })

  function isFavorite(programId: string) {
    return favoriteIds.value.includes(programId)
  }

  function toggleFavorite(programId: string) {
    favoriteIds.value = isFavorite(programId)
      ? favoriteIds.value.filter(id => id !== programId)
      : [...favoriteIds.value, programId]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds.value))
  }

  return { isFavorite, toggleFavorite }
}

function load(): string[] {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}
