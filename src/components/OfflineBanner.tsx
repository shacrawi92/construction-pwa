import { useSyncStore } from '@/store/sync.store'
import { WifiOff, RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function OfflineBanner() {
  const { t } = useTranslation()
  const { queue, isSyncing } = useSyncStore()

  return (
    <div className="offline-banner">
      {isSyncing
        ? <><RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> {t('common.syncing')} ({queue.length} pending)</>
        : <><WifiOff size={14} /> {t('common.offline')} {queue.length > 0 && `(${queue.length} queued)`}</>
      }
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  )
}
