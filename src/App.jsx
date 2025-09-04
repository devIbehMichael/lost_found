import {useState} from 'react'
import { supabase } from "./supabaseClient"

import './output.css'
import AddItem from './AddItem'
import ItemsList from './ItemsList'

function App() {


  return (
   <div>
    <AddItem />
    <ItemsList />
   </div>
  )
}
export default App
