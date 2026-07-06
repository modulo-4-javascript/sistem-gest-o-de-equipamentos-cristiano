import { Tag } from 'antd'
import styled from 'styled-components'
import type { LocationStatus } from '../../types/location'

interface StatusTagProps {
  $status: LocationStatus
}

function getTextColor(status: LocationStatus) {
  return status === 'ACTIVE' ? '#007c8c' : '#6b7280'
}

function getBackgroundColor(status: LocationStatus) {
  return status === 'ACTIVE' ? '#e6fffb' : '#f3f4f6'
}

function getBorderColor(status: LocationStatus) {
  return status === 'ACTIVE' ? '#b5f5ec' : '#dde6ee'
}

export const StatusTag = styled(Tag)<StatusTagProps>`
  &.ant-tag {
    margin: 0;
    color: ${({ $status }) => getTextColor($status)};
    background: ${({ $status }) => getBackgroundColor($status)};
    border-color: ${({ $status }) => getBorderColor($status)};
    border-radius: 999px;
    font-weight: 600;
  }
`
