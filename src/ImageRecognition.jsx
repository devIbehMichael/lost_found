import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import { supabase } from "./supabaseClient";


export default function ImageRecognition() {
  const [result, setResult] = useState("");
  const [match, setMatch] = useState(null); // 👈 store matched item
  const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

  async function getEmbedding(model, imgEl) {
    const activation = model.infer(imgEl, true); 
    const embedding = activation.flatten(); 
    return embedding;
  }

  async function cosineSimilarity(tensorA, tensorB) {
    const dot = tf.sum(tf.mul(tensorA, tensorB));
    const normA = tf.norm(tensorA);
    const normB = tf.norm(tensorB);
    const sim = dot.div(normA.mul(normB));
    return sim.array();
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setResult("Analyzing image...");
    setMatch(null);

    const model = await mobilenet.load();

    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    await new Promise((resolve) => (img.onload = resolve));

    const uploadedEmbedding = await getEmbedding(model, img);

    const { data: items, error } = await supabase.from("items").select("*");
    if (error) {
      console.error(error);
      setResult("Error fetching items");
      setLoading(false);
      return;
    }

    let bestMatch = null;
    let bestScore = -1;

    for (const item of items) {
      if (!item.image_url) continue;

      const dbImg = document.createElement("img");
      dbImg.crossOrigin = "anonymous";
      dbImg.src = item.image_url;
      await new Promise((resolve) => (dbImg.onload = resolve));

      const dbEmbedding = await getEmbedding(model, dbImg);
      const score = await cosineSimilarity(uploadedEmbedding, dbEmbedding);

      if (score > bestScore) {
        bestScore = score;
        bestMatch = { ...item, score };
      }

      dbEmbedding.dispose();
    }

    uploadedEmbedding.dispose();

    if (bestMatch && bestScore > 0.7) {
      setResult(`Best match: ${bestMatch.title} (score: ${bestScore.toFixed(2)})`);
      setMatch(bestMatch); // 👈 save best match
    } else {
      setResult("No close match found.");
      navigate("/items"); // 👈 redirect if no match
    }

    setLoading(false);
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Image Recognition</h2>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {loading ? <p>Processing...</p> : <p>{result}</p>}

      {match && (
        <div className="mt-4 border p-4 rounded shadow">
          <img
            src={match.image_url}
            alt={match.title}
            className="w-40 h-40 object-cover mb-2 rounded"
          />
          <h3 className="text-lg font-semibold">{match.title}</h3>
          <p>{match.description}</p>
          <p className="text-sm text-gray-600">📍 {match.location}</p>
          <p className="text-sm">📞 {match.phone_number}</p>
          <p className="font-bold">
            Match score: {match.score.toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
}
