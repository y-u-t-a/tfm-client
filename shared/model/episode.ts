export interface Episode {
  id: string
  title: string
  description: string
  /** 秒数 */
  durationSeconds: number
  /** unixtime millis */
  publishedAt: number
  audio: string
  thumbnail: string
}
