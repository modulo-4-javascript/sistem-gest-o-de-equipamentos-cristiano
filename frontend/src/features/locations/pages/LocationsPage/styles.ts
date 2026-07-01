import styled from 'styled-components'

export const Container = styled.section`
  width: 100%;
  max-width: 1440px;
`

export const Title = styled.h2`
  margin: 0;
  color: #002a64;
  font-size: 32px;
  font-weight: 700;
  line-height: 40px;
`

export const Description = styled.p`
  margin: 4px 0 0 0;
  color: #6b7280;
  font-size: 16px;
  line-height: 24px;
`

export const LocationsList = styled.ul`
  margin: 24px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 14px;
`

export const LocationItem = styled.li`
  background: #ffffff;
  border: 1px solid #d9d9d9;
  border-radius: 12px;
  padding: 18px 22px;
  color: #1f2937;
  font-size: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
`
