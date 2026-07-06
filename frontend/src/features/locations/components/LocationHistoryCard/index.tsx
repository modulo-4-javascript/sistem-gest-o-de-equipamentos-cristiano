import { formatLocationDate } from '../../types/location'
import type { LocationHistoryItem } from '../../types/location'
import {
  DateText,
  Description,
  EmptyText,
  Event,
  EventTitle,
  HistoryCard,
  Timeline,
  Title,
} from './styles'

interface LocationHistoryCardProps {
  history: LocationHistoryItem[]
}

export function LocationHistoryCard({ history }: LocationHistoryCardProps) {
  return (
    <HistoryCard styles={{ body: { padding: 24 } }}>
      <Title>Histórico de movimentações</Title>

      {history.length === 0 ? (
        <EmptyText>Nenhuma movimentação registrada para este local.</EmptyText>
      ) : (
        <Timeline>
          {history.map((event) => (
            <Event key={event.id}>
              <DateText>{formatLocationDate(event.createdAt)}</DateText>
              <EventTitle>{event.title}</EventTitle>
              <Description>{event.description}</Description>
            </Event>
          ))}
        </Timeline>
      )}
    </HistoryCard>
  )
}
