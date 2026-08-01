/** 秒数を MM:SS 形式に変換する。1時間以上の場合は H:MM:SS 形式 */
export function formatDuration(seconds: number): string {
  // audio の duration はメタデータ読み込み前や長さ不明のストリームで NaN / Infinity になる
  if (!Number.isFinite(seconds) || seconds < 0) return '--:--'

  const h = Math.floor(seconds / 3600)
  const m = Math.floor(seconds / 60) % 60
  const s = Math.floor(seconds % 60)
  const mmss = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return h > 0 ? `${h}:${mmss}` : mmss
}
