import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './output.css'
import App from './App.jsx'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { supabase } from './supabaseClient'

createRoot(document.getElementById('root')).render(
  <SessionContextProvider supabaseClient={supabase}>
    <App />
  </SessionContextProvider>,
)
