import { message } from 'antd'
import { useState } from 'react'
import { AppLayout } from '../../../../app/layout/AppLayout'
import { EquipmentFilters } from '../../components/EquipmentFilters'
import { EquipmentTable } from '../../components/EquipmentTable'
import { PageHeader } from '../../components/PageHeader'
import { SummaryCards } from '../../components/SummaryCards'
import {
  equipmentMock,
  equipmentSummaryMock,
  statusOptions,
  typeOptions,
} from '../../mocks/equipment.mock'
import type { EquipmentStatus, EquipmentType } from '../../types/equipment'
import { Container } from './styles'

export function EquipmentPage() {
  const [messageApi, contextHolder] = message.useMessage()
  const [searchText, setSearchText] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<EquipmentStatus>()
  const [selectedType, setSelectedType] = useState<EquipmentType>()

  function handleCreateEquipment() {
    messageApi.info('Nesta aula vamos focar na construção visual da tela.')
  }

  function handleClearFilters() {
    setSearchText('')
    setSelectedStatus(undefined)
    setSelectedType(undefined)
  }

  const visibleEquipment = equipmentMock

  return (
    <AppLayout currentPage="Equipamentos">
      {contextHolder}
      <Container>
        <PageHeader onCreateEquipment={handleCreateEquipment} />
        <SummaryCards summaries={equipmentSummaryMock} />
        <EquipmentFilters
          searchText={searchText}
          selectedStatus={selectedStatus}
          selectedType={selectedType}
          statusOptions={statusOptions}
          typeOptions={typeOptions}
          onSearchChange={setSearchText}
          onStatusChange={setSelectedStatus}
          onTypeChange={setSelectedType}
          onClear={handleClearFilters}
        />
        <EquipmentTable equipments={visibleEquipment} />
      </Container>
    </AppLayout>
  )
}
