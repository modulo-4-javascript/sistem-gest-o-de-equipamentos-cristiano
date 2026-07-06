import { Alert, App as AntDesignApp, Spin } from 'antd'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppLayout } from '../../../../app/layout/AppLayout'
import { getRequestErrorMessage } from '../../../../shared/http/getRequestErrorMessage'
import { DetailSummaryCards } from '../../components/DetailSummaryCards'
import { DetailsHeader } from '../../components/DetailsHeader'
import {
  LocationFormModal,
  type LocationFormValues,
} from '../../components/LocationFormModal'
import { LocationEquipmentCard } from '../../components/LocationEquipmentCard'
import { LocationHistoryCard } from '../../components/LocationHistoryCard'
import { LocationInfoCard } from '../../components/LocationInfoCard'
import { LocationNotesCard } from '../../components/LocationNotesCard'
import { LocationRemoveModal } from '../../components/LocationRemoveModal'
import { LocationStatusModal } from '../../components/LocationStatusModal'
import type { LocationStatusFormValues } from '../../components/LocationStatusModal'
import { useDeleteLocation } from '../../hooks/useDeleteLocation'
import { useLocationDetails } from '../../hooks/useLocationDetails'
import { useLocationEquipment } from '../../hooks/useLocationEquipment'
import { useLocationHistory } from '../../hooks/useLocationHistory'
import { useUpdateLocation } from '../../hooks/useUpdateLocation'
import { useUpdateLocationStatus } from '../../hooks/useUpdateLocationStatus'
import {
  formatLocationDate,
  getLocationStatusLabel,
  locationStatusOptions,
  locationTypeOptions,
  type CreateLocationPayload,
  type LocationDetails,
  type LocationDetailSummary,
} from '../../types/location'
import {
  Container,
  ContentGrid,
  MainColumn,
  SideColumn,
  StarterBox,
} from './styles'

const defaultPageSize = 10

// Antes de enviar para a API, limpamos espaços e transformamos campos vazios em undefined/null.
function buildLocationPayload(values: LocationFormValues): CreateLocationPayload {
  return {
    code: values.code.trim(),
    name: values.name.trim(),
    type: values.type,
    building: values.building?.trim() || undefined,
    floor: values.floor?.trim() || undefined,
    room: values.room?.trim() || undefined,
    description: values.description?.trim() || null,
    status: values.status,
  } as CreateLocationPayload
}

function formatRoomLabel(room?: string) {
  if (!room) {
    return undefined
  }

  return room.toLowerCase().startsWith('sala') ? room : `Sala ${room}`
}

function formatLocationAddress(location: LocationDetails) {
  const addressParts = [
    location.building,
    formatRoomLabel(location.room) ?? location.floor,
  ].filter(Boolean)

  return addressParts.length > 0 ? addressParts.join(' • ') : 'Não informado'
}

// A API devolve os dados completos; esta função escolhe o que vira card de resumo.
function buildDetailSummary(location: LocationDetails): LocationDetailSummary[] {
  return [
    {
      id: 'status',
      title: 'Situação',
      value: getLocationStatusLabel(location.status),
      description: location.status === 'ACTIVE' ? 'Pronto para uso' : 'Local desativado',
    },
    {
      id: 'address',
      title: 'Endereço',
      value: formatLocationAddress(location),
      description: 'Prédio e sala',
    },
    {
      id: 'equipmentCount',
      title: 'Equipamentos',
      value: String(location.equipmentCount),
      description: `${location.equipmentSummary.available} disponíveis`,
    },
    {
      id: 'updatedAt',
      title: 'Atualizado',
      value: formatLocationDate(location.updatedAt),
      description: 'Última alteração',
    },
  ]
}

export function LocationDetailsPage() {
  const { message: messageApi } = AntDesignApp.useApp()
  const navigate = useNavigate()

  // O ID vem da URL /locations/:locationId e decide qual local buscar.
  const { locationId } = useParams()

  // Estes estados controlam apenas os modais da página de detalhes.
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)
  const [equipmentPage, setEquipmentPage] = useState(1)
  const [equipmentPageSize, setEquipmentPageSize] = useState(defaultPageSize)

  // Hooks que usam useEffect + axios para buscar e salvar dados na API.
  const locationQuery = useLocationDetails(locationId)
  const locationEquipmentQuery = useLocationEquipment(locationId, {
    page: equipmentPage,
    pageSize: equipmentPageSize,
  })
  const locationHistoryQuery = useLocationHistory(locationId, { page: 1, pageSize: 10 })
  const updateLocation = useUpdateLocation()
  const updateLocationStatus = useUpdateLocationStatus()
  const deleteLocation = useDeleteLocation()

  const location = locationQuery.data
  const equipmentList = locationEquipmentQuery.data?.data ?? []
  const equipmentPaginationInfo = locationEquipmentQuery.data?.meta
  const historyList = locationHistoryQuery.data?.data ?? []

  // Loading e erro combinam a busca necessária para montar o detalhe.
  const isLoading = locationQuery.isLoading
  const loadError =
    (!locationId ? 'ID do local não encontrado na rota.' : '') || locationQuery.errorMessage
  const isSavingForm = updateLocation.isLoading
  const isSavingStatus = updateLocationStatus.isLoading
  const isRemovingLocation = deleteLocation.isLoading

  // Cards de resumo são derivados do local carregado.
  const summaries = location ? buildDetailSummary(location) : []

  function handleEquipmentPageChange(nextPage: number, nextPageSize: number) {
    setEquipmentPage(nextPage)
    setEquipmentPageSize(nextPageSize)
  }

  // Salva a edição e depois recarrega o detalhe para mostrar os dados atualizados.
  async function handleSubmitFormModal(values: LocationFormValues) {
    if (!location) {
      return
    }

    try {
      await updateLocation.update({
        locationId: location.id,
        payload: buildLocationPayload(values),
      })
      await locationQuery.reload()
      messageApi.success('Local atualizado com sucesso.')
      setIsFormModalOpen(false)
    } catch (error) {
      messageApi.error(getRequestErrorMessage(error))
    }
  }

  // Salva a nova situação e depois recarrega o detalhe para atualizar cards e histórico.
  async function handleSubmitStatusModal(values: LocationStatusFormValues) {
    if (!location) {
      return
    }

    try {
      await updateLocationStatus.updateStatus({
        locationId: location.id,
        payload: {
          status: values.status,
          note: values.note?.trim() || null,
        },
      })
      await Promise.all([locationQuery.reload(), locationHistoryQuery.reload()])
      messageApi.success('Situação atualizada com sucesso.')
      setIsStatusModalOpen(false)
    } catch (error) {
      messageApi.error(getRequestErrorMessage(error))
    }
  }

  async function handleConfirmRemoveLocation() {
    if (!location) {
      return
    }

    try {
      await deleteLocation.remove(location.id)
      messageApi.success('Local excluído com sucesso.')
      setIsRemoveModalOpen(false)
      navigate('/locations')
    } catch (error) {
      messageApi.error(getRequestErrorMessage(error))
    }
  }

  // Enquanto o detalhe carrega, mostramos um estado simples de espera.
  if (isLoading) {
    return (
      <AppLayout currentPage="Detalhes">
        <Container>
          <StarterBox>
            <Spin /> Carregando local...
          </StarterBox>
        </Container>
      </AppLayout>
    )
  }

  // Se a API falhar ou o local não existir, mostramos uma mensagem de erro didática.
  if (loadError || !location) {
    return (
      <AppLayout currentPage="Detalhes">
        <Container>
          <Alert
            showIcon
            message="Local não encontrado"
            description={loadError || 'Não foi possível exibir este local.'}
            type="error"
          />
        </Container>
      </AppLayout>
    )
  }

  return (
    <AppLayout currentPage="Detalhes">
      <Container>
        {/* Cabeçalho com ações principais: voltar, editar, situação e excluir. */}
        <DetailsHeader
          location={location}
          onBack={() => navigate('/locations')}
          onChangeStatus={() => setIsStatusModalOpen(true)}
          onEdit={() => setIsFormModalOpen(true)}
          onRemove={() => setIsRemoveModalOpen(true)}
        />

        {/* Cards calculados a partir do local carregado pela API. */}
        <DetailSummaryCards summaries={summaries} />

        {/* Conteúdo principal: informações gerais, descrição, equipamentos e histórico. */}
        <ContentGrid>
          <MainColumn>
            <LocationInfoCard location={location} />
            <LocationNotesCard description={location.description} />
            <LocationEquipmentCard
              equipment={equipmentList}
              loading={locationEquipmentQuery.isLoading}
              pagination={{
                current: equipmentPage,
                pageSize: equipmentPageSize,
                total: equipmentPaginationInfo?.total ?? 0,
                showSizeChanger: true,
                pageSizeOptions: [5, 10, 20],
                showTotal: (total) => `${total} equipamentos no total`,
                onChange: handleEquipmentPageChange,
              }}
            />
          </MainColumn>

          <SideColumn>
            <LocationHistoryCard history={historyList} />
          </SideColumn>
        </ContentGrid>

        {/* Modal de edição do local atual. */}
        <LocationFormModal
          confirmLoading={isSavingForm}
          location={location}
          mode="edit"
          open={isFormModalOpen}
          statusOptions={locationStatusOptions}
          typeOptions={locationTypeOptions}
          onCancel={() => setIsFormModalOpen(false)}
          onSubmit={handleSubmitFormModal}
        />

        {/* Modal específico para mudança rápida de situação. */}
        <LocationStatusModal
          confirmLoading={isSavingStatus}
          location={location}
          open={isStatusModalOpen}
          statusOptions={locationStatusOptions}
          onCancel={() => setIsStatusModalOpen(false)}
          onSubmit={handleSubmitStatusModal}
        />

        {/* Modal de confirmação que chama DELETE /locations/:locationId. */}
        <LocationRemoveModal
          confirmLoading={isRemovingLocation}
          location={location}
          open={isRemoveModalOpen}
          onCancel={() => setIsRemoveModalOpen(false)}
          onConfirm={handleConfirmRemoveLocation}
        />
      </Container>
    </AppLayout>
  )
}
