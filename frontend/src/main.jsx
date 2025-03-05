import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { NoteState } from './context/NoteState.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <NoteState >
    <App />
    </NoteState>
    </BrowserRouter>
  </StrictMode>,
)
