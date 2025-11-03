export interface Episode {
  id: string
  title: string
  description: string
  length: string
  /** unixtime millis */
  publishedAt: number
  audio: string
  thumbnail: string
}
