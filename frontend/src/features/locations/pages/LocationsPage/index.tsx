import { AppLayout } from '../../../../app/layout/AppLayout'
import { equipmentMock } from '../../../equipment/mocks/equipment.mock'
import { Container, Description, LocationItem, LocationsList, Title } from './styles'

const uniqueLocations = Array.from(new Set(equipmentMock.map((item) => item.location)))

export function LocationsPage() {
  return (
    <AppLayout currentPage="Localizações">
      <Container>
        <Title>Localizações</Title>
        <Description>
          Esta página mostra as localizações dos equipamentos cadastrados no sistema.
        </Description>

        <LocationsList>
          {uniqueLocations.map((location) => (
            <LocationItem key={location}>{location}</LocationItem>
          ))}
        </LocationsList>
      </Container>
    </AppLayout>
  )
}
