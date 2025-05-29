// hooks/useParticipantsMap.js
import { useCollection } from './useCollection' // ajusta la ruta segons el teu projecte
import { useMemo } from 'react'

export default function useParticipantsMap() {
  const { documents: participants, loading, error } = useCollection('participants')

  const participantsMap = useMemo(() => {
    const map = new Map()
    if (participants) {
      participants.forEach(participant => {
        if (participant.uid && participant.username) {
          map.set(participant.uid, participant.username)
        }
      })
    }
    return map
  }, [participants])

  return { participantsMap, loading, error }
}
