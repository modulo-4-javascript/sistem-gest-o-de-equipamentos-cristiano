import { getLocationStatusLabel, type LocationStatus } from '../../types/location'
import { StatusTag } from './styles'

interface StatusBadgeProps {
  status: LocationStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <StatusTag $status={status}>{getLocationStatusLabel(status)}</StatusTag>
}
