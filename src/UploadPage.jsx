"use client";
import { useState } from "react";

export default function UploadTest() {
  const [message, setMessage] = useState("");

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setMessage(JSON.stringify(data));
  }

  return (
    <form onSubmit={handleUpload}>
      <input type="file" name="file" required />
      <button type="submit">Upload</button>
      <p>{message}</p>
    </form>
  );
}
