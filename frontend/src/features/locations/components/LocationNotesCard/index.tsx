import { NotesCard, NotesText, Title } from './styles'

interface LocationNotesCardProps {
  description?: string | null
}

export function LocationNotesCard({ description }: LocationNotesCardProps) {
  return (
    <NotesCard styles={{ body: { padding: 24 } }}>
      <Title>Descrição</Title>
      <NotesText>{description || 'Nenhuma descrição cadastrada.'}</NotesText>
    </NotesCard>
  )
}
