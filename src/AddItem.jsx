import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { useUser } from "@supabase/auth-helpers-react";
import * as mobilenet from "@tensorflow-models/mobilenet";
import "@tensorflow/tfjs";

export default function AddItem({ fetchItems }) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("lost");
  const [model, setModel] = useState(null);
  const user = useUser();

  // Load mobilenet model once
  useEffect(() => {
    async function loadModel() {
      const loadedModel = await mobilenet.load();
      setModel(loadedModel);
    }
    loadModel();
  }, []);

  async function uploadImage(file) {
    if (!file) return null;

    const filePath = `${Date.now()}_${file.name}`;

    const { data, error } = await supabase.storage
      .from("items-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Error uploading image:", error);
      return null;
    }

    // get public URL
    const { data: publicUrlData } = supabase.storage
      .from("items-images")
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  }

  // Extract embedding using mobilenet
  async function getEmbedding(file) {
    if (!model) return null;
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    await new Promise((resolve) => (img.onload = resolve));
    const embedding = model.infer(img, true);
    return embedding.arraySync(); // returns array of numbers
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please log in.");

    let imageUrl = null;
    let embedding = null;

    if (file) {
      imageUrl = await uploadImage(file);
      if (!imageUrl) return alert("Image upload failed");

      // ✅ Generate embedding
      embedding = await getEmbedding(file);
    }

    const { error } = await supabase.from("items").insert([
      {
        title,
        description,
        category,
        location,
        status,
        image_url: imageUrl,
        phone_number: phone,
        user_id: user.id,
        embedding, // save embedding as JSONB
      },
    ]);

    if (error) {
      console.error("Insert error:", error);
      return alert("Failed to add item");
    }

    fetchItems();
    setTitle("");
    setDescription("");
    setCategory("");
    setLocation("");
    setStatus("lost");
    setPhone("");
    setFile(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h2 className="text-xl font-semibold">Report Lost/Found Item</h2>
      <input className="border p-2 w-full" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <textarea className="border p-2 w-full" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input className="border p-2 w-full" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
      <input className="border p-2 w-full" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <input type="number" className="border p-2 w-full" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <select className="border p-2 w-full" value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="lost">Lost</option>
        <option value="found">Found</option>
      </select>
      <button className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
    </form>
  );
}
