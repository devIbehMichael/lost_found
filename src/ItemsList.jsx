import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import AddItem from "./AddItem"; // 👈 import form

function ItemsList() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // ✅ move fetchItems OUTSIDE useEffect
  const fetchItems = async () => {
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error(error);
    else setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="p-6 gap-4 ">
      <h2 className="text-2xl font-bold mb-4">Lost & Found Items</h2>
       {/* Button to show AddItem form */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        {showForm ? "Cancel" : "Add Lost/Found Item"}
      </button>

      {showForm && <AddItem fetchItems={fetchItems} />}
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="border p-4 rounded-lg shadow hover:shadow-lg transition flex flex-row items-start"
          >
            {item.image_url && (
              <img
                src={item.image_url}
                alt={item.title}
                className="w-32 h-32 object-cover rounded-lg mr-4 border-2 border-gray-300"
              />
            )}
            <div>
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
              <p className="text-sm text-gray-500">📍 {item.location}</p>
              <p
                className={`mt-2 font-bold ${
                  item.status === "lost" ? "text-red-500" : "text-green-500"
                }`}
              >
                {item.status?.toUpperCase()}
              </p>
              <p>{item.phone_number}</p>
            </div>
          </div>
        ))}
      </div>

     
    </div>
  );
}

export default ItemsList;
