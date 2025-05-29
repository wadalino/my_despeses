import { useCollection } from './useCollection'
import { useMemo } from 'react'

export default function useUsernameByUid(uid) {
  const { documents: participants, loading, error } = useCollection('participants')

  const username = useMemo(() => {
    if (!participants || !uid) return null
    const match = participants.find(p => p.uid === uid)
    return match?.username || null
  }, [participants, uid])

  return { username, loading, error }
}
