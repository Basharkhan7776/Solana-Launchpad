import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { RpcProvider } from './context/RpcContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RpcProvider>
      <App />
    </RpcProvider>
  </StrictMode>,
)
