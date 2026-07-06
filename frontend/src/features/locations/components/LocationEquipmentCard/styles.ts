import { Card } from 'antd'
import styled from 'styled-components'

export const EquipmentCard = styled(Card)`
  &.ant-card {
    border-color: #dde6ee;
    box-shadow: 0 1px 2px rgb(17 24 39 / 5%);
  }

  .ant-card-body {
    padding: 0;
  }
`

export const Title = styled.h3`
  margin: 0;
  padding: 24px 24px 16px;
  color: #002a64;
  font-size: 20px;
  font-weight: 700;
  line-height: 28px;
`
