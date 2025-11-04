import { useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import { supabase } from "./supabaseClient";
import { Link } from "react-router-dom";
import DragAndDropUpload from "./draganddrop.jsx"

export default function ImageRecognition() {
  const [result, setResult] = useState("");
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(false);

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

  async function handleImageUpload(file) {
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
      setMatch(bestMatch);
    } else {
      setResult("No match found.");
    }

    setLoading(false);
  }

  return (
    <div className="p-4 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-4">Search for Lost Items</h2>
      
      {/* ✅ Use Drag & Drop upload */}
      <DragAndDropUpload onFileSelect={handleImageUpload} />

      {loading ? (
        <p className="mt-4 text-gray-600">Processing...</p>
      ) : (
        <p className="mt-4 text-gray-700">{result}</p>
      )}

      {/* show link if no match */}
      {!loading && result === "No match found." && (
        <p className="mt-2 text-red-500">
          No match found.{" "}
          <Link to="/items" className="text-blue-600 underline">
            Please check the list
          </Link>
        </p>
      )}

      {/* ✅ If match found, show details */}
      {match && (
        <div className="mt-6 border p-4 rounded shadow-lg w-full max-w-sm text-center">
          <img
            src={match.image_url}
            alt={match.title}
            className="w-40 h-40 object-cover mx-auto mb-3 rounded"
          />
          <h3 className="text-lg font-semibold">{match.title}</h3>
          <p className="text-gray-600 mb-1">{match.description}</p>

          <p
            className={`mt-2 font-bold ${
              match.status === "lost" ? "text-red-500" : "text-green-500"
            }`}
          >
            {match.status?.toUpperCase()}
          </p>

          <p className="text-sm text-gray-600 mt-1">📍 {match.location}</p>
          <p className="text-sm text-gray-600">📞 {match.phone_number}</p>
          <p className="font-bold mt-2">Match score: {match.score.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}
