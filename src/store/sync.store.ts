import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { openDB } from 'idb'

export interface QueuedMutation {
  id: string
  url: string
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body: object
  queuedAt: string
}

interface SyncState {
  queue: QueuedMutation[]
  isSyncing: boolean
  isOnline: boolean
  enqueue: (mutation: Omit<QueuedMutation, 'id' | 'queuedAt'>) => Promise<void>
  dequeue: (id: string) => Promise<void>
  setOnline: (v: boolean) => void
  syncAll: () => Promise<void>
}

const DB_NAME = 'construct-offline'
const STORE   = 'mutations'

async function getDb() {
  return openDB(DB_NAME, 1, {
    upgrade(db) { db.createObjectStore(STORE, { keyPath: 'id' }) },
  })
}

export const useSyncStore = create<SyncState>()(
  persist(
    (set, get) => ({
      queue: [],
      isSyncing: false,
      isOnline: navigator.onLine,

      enqueue: async (mutation) => {
        const item: QueuedMutation = {
          ...mutation,
          id: crypto.randomUUID(),
          queuedAt: new Date().toISOString(),
        }
        const db = await getDb()
        await db.put(STORE, item)
        set(s => ({ queue: [...s.queue, item] }))
      },

      dequeue: async (id) => {
        const db = await getDb()
        await db.delete(STORE, id)
        set(s => ({ queue: s.queue.filter(q => q.id !== id) }))
      },

      setOnline: (v) => {
        set({ isOnline: v })
        if (v) get().syncAll()
      },

      syncAll: async () => {
        const { queue, dequeue, isSyncing } = get()
        if (isSyncing || queue.length === 0) return
        set({ isSyncing: true })
        const token = localStorage.getItem('auth_token')
        for (const mutation of queue) {
          try {
            await fetch(mutation.url, {
              method:  mutation.method,
              headers: {
                'Content-Type':  'application/json',
                'Accept':        'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify(mutation.body),
            })
            await dequeue(mutation.id)
          } catch {}
        }
        set({ isSyncing: false })
      },
    }),
    {
      name: 'sync-store',
      partialize: (s) => ({ queue: s.queue }),
    }
  )
)
