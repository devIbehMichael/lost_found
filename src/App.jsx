import {useState} from 'react'
import { supabase } from "./supabaseClient"

import './output.css'
import AddItem from './AddItem'
import ItemsList from './ItemsList'

function App() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')
  const [status, setStatus] = useState('')

  async function addItem() {
    const { data, error } = await supabase
      .from('items')
      .insert([
        {
          title,
          description,
          category,
          location,
          status,
          image_url: 'https://example.com/image.jpg'
        }
      ])

    if (error) {
      console.error('Insert error:', error)
    } else {
      console.log('Inserted item:', data)
      alert('Item added successfully!')
    }
  }

  return (
    <div>
      <h1>Lost & Found</h1>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <input
        type="text"
        placeholder="Status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      />
      <button onClick={addItem}>Add Item</button>
    </div>
  )
}
export default App
