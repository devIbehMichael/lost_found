import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

function ItemsList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .order("created_at", { ascending: false }); // newest first

      if (error) {
        console.error("Error fetching items:", error.message);
      } else {
        setItems(data);
      }
    };

    fetchItems();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Lost & Found Items</h2>
      {items.length === 0 ? (
        <p>No items found yet.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.id} className="border p-3 rounded">
              <h3 className="font-semibold">{item.title}</h3>
              <p>{item.description}</p>
              <p className="text-sm text-gray-600">
                Category: {item.category} | Location: {item.location}
              </p>
              <p className="text-xs text-gray-400">
                Reported: {new Date(item.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ItemsList;
