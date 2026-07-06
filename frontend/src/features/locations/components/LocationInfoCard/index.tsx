import {
  formatLocationDate,
  getLocationTypeLabel,
  type LocationDetails,
} from '../../types/location'
import { DescriptionList, Detail, InfoCard, Term, Title, Value } from './styles'

interface LocationInfoCardProps {
  location: LocationDetails
}

export function LocationInfoCard({ location }: LocationInfoCardProps) {
  return (
    <InfoCard styles={{ body: { padding: 24 } }}>
      <Title>Informações gerais</Title>

      <DescriptionList>
        <Detail>
          <Term>Tipo</Term>
          <Value>{getLocationTypeLabel(location.type)}</Value>
        </Detail>

        <Detail>
          <Term>Prédio</Term>
          <Value>{location.building ?? 'Não informado'}</Value>
        </Detail>

        <Detail>
          <Term>Andar</Term>
          <Value>{location.floor ?? 'Não informado'}</Value>
        </Detail>

        <Detail>
          <Term>Sala</Term>
          <Value>{location.room ?? 'Não informado'}</Value>
        </Detail>

        <Detail>
          <Term>Data de cadastro</Term>
          <Value>{formatLocationDate(location.createdAt)}</Value>
        </Detail>

        <Detail>
          <Term>Última atualização</Term>
          <Value>{formatLocationDate(location.updatedAt)}</Value>
        </Detail>
      </DescriptionList>
    </InfoCard>
  )
}
