import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import PivotApp from './PivotApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PivotApp />
  </StrictMode>,
)
