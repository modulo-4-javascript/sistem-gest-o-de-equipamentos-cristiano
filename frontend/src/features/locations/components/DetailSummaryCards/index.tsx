import type { LocationDetailSummary } from '../../types/location'
import { Description, Grid, Label, SummaryCard, Value } from './styles'

interface DetailSummaryCardsProps {
  summaries: LocationDetailSummary[]
}

export function DetailSummaryCards({ summaries }: DetailSummaryCardsProps) {
  return (
    <Grid aria-label="Resumo do local">
      {summaries.map((summary) => (
        <SummaryCard key={summary.id} styles={{ body: { padding: 16 } }}>
          <Label>{summary.title}</Label>
          <Value>{summary.value}</Value>
          <Description>{summary.description}</Description>
        </SummaryCard>
      ))}
    </Grid>
  )
}
