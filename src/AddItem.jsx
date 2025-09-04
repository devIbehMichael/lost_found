import { useState } from "react";
import { supabase } from "./supabaseClient";
import { useUser } from "@supabase/auth-helpers-react";

export default function AddItem({fetchItems}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("lost");
    const user = useUser();

const handleSubmit = async (e) => {
  e.preventDefault();

  const { data, error } = await supabase
    .from("items")
    .insert([
      {
        title,
        description,
        category,
        location,
        status,
        user_id: user?.id, // link to logged-in user
      },
    ]);

if (error) {
  console.error("Error inserting item:", error);
  alert("Failed to add item: " + error.message);
} else {
  console.log("Item added:", data);
  alert("Item submitted successfully!");
  // clear form
  setTitle("");
  setDescription("");
  setCategory("");
  setLocation("");
  setStatus("lost");
  fetchItems(); // refresh list after insert
}
};

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h2 className="text-xl font-semibold">Report Lost/Found Item</h2>
      <input className="border p-2 w-full" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required />
      <textarea className="border p-2 w-full" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
      <input className="border p-2 w-full" placeholder="Category (e.g., phone, laptop)" value={category} onChange={e=>setCategory(e.target.value)} />
      <input className="border p-2 w-full" placeholder="Location" value={location} onChange={e=>setLocation(e.target.value)} />
      <select className="border p-2 w-full" value={status} onChange={e=>setStatus(e.target.value)}>
        <option value="lost">Lost</option>
        <option value="found">Found</option>
      </select>
      <button className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
    </form>
  );
}
