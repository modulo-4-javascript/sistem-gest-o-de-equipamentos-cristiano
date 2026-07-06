import ComputerOutlined from '@mui/icons-material/ComputerOutlined'
import { Table } from 'antd'
import type { TableProps } from 'antd'
import {
  ResourceCell,
  ResourceCode,
  ResourceIcon,
  ResourceName,
} from '../../../../shared/components/DataTable/styles'
import { StatusBadge } from '../../../equipment/components/StatusBadge'
import { formatEquipmentDate, getEquipmentTypeLabel } from '../../../equipment/types/equipment'
import type { LocationEquipment } from '../../types/location'
import { EquipmentCard, Title } from './styles'

interface LocationEquipmentCardProps {
  equipment: LocationEquipment[]
  loading?: boolean
  pagination?: TableProps<LocationEquipment>['pagination']
}

const columns: TableProps<LocationEquipment>['columns'] = [
  {
    title: 'Equipamento',
    dataIndex: 'name',
    key: 'name',
    render: (_, equipment) => (
      <ResourceCell>
        <ResourceIcon>
          <ComputerOutlined fontSize="small" />
        </ResourceIcon>
        <span>
          <ResourceName>{equipment.name}</ResourceName>
          <ResourceCode>{equipment.code}</ResourceCode>
        </span>
      </ResourceCell>
    ),
  },
  {
    title: 'Tipo',
    dataIndex: 'type',
    key: 'type',
    render: (type: LocationEquipment['type']) => getEquipmentTypeLabel(type),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: LocationEquipment['status']) => <StatusBadge status={status} />,
  },
  {
    title: 'Atualizado',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    render: (updatedAt: LocationEquipment['updatedAt']) => formatEquipmentDate(updatedAt),
  },
]

export function LocationEquipmentCard({
  equipment,
  loading,
  pagination,
}: LocationEquipmentCardProps) {
  return (
    <EquipmentCard>
      <Title>Equipamentos vinculados</Title>

      <Table
        columns={columns}
        dataSource={equipment}
        loading={loading}
        locale={{ emptyText: 'Nenhum equipamento vinculado a este local.' }}
        pagination={pagination}
        rowKey="id"
        size="middle"
        tableLayout="fixed"
        scroll={{ x: 'max-content' }}
      />
    </EquipmentCard>
  )
}
