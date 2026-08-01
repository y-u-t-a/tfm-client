import type { Episode } from '~~/shared/model/episode'

/** 音声を取得してファイル保存ダイアログを開く。進捗・キャンセルはトーストで通知する */
export function useEpisodeDownload() {
  const toast = useToast()
  const downloadingFile = ref<string | null>(null)

  async function download(episode: Episode) {
    downloadingFile.value = episode.audio
    const controller = new AbortController()
    const { id } = toast.add({
      title: 'ダウンロード中...',
      icon: 'i-lucide-download',
      color: 'info',
      duration: 0,
      close: false,
      orientation: 'horizontal',
      actions: [{
        label: 'キャンセル',
        color: 'info',
        variant: 'outline',
        onClick: () => controller.abort(),
      }],
    })
    try {
      const res = await fetch(episode.audio, { signal: controller.signal })
      const blob = await res.blob()
      toast.remove(id)
      toast.add({ title: 'ダウンロード完了', icon: 'i-lucide-check', color: 'success', progress: false })

      // ファイル保存ダイアログの表示
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${episode.title.replace(/[\\/:*?"<>|]/g, '_')}.mp3`
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      toast.remove(id)
      if (e instanceof DOMException && e.name === 'AbortError') {
        toast.add({ title: 'ダウンロードをキャンセルしました', icon: 'i-lucide-circle-x', color: 'warning', progress: false })
      } else {
        toast.add({ title: 'ダウンロードに失敗しました', icon: 'i-lucide-circle-x', color: 'error', progress: false })
      }
    } finally {
      downloadingFile.value = null
    }
  }

  return { downloadingFile, download }
}
