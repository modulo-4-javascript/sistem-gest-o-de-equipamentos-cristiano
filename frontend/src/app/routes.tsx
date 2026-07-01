import { Navigate, Route, Routes } from 'react-router-dom'
import { EquipmentPage } from '../features/equipment/pages/EquipmentPage'
import { LocationsPage } from '../features/locations/pages/LocationsPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/equipment" replace />} />
      <Route path="/equipment" element={<EquipmentPage />} />
      <Route path="/locations" element={<LocationsPage />} />
      <Route path="*" element={<Navigate to="/equipment" replace />} />
    </Routes>
  )
}
