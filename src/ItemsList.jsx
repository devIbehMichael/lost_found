import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import AddItem from "./AddItem";

function ItemsList() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);

  // For image preview modal
  const [previewImage, setPreviewImage] = useState(null);

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

  // ✅ Filtered items based on search input
  const filteredItems = items.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.title?.toLowerCase().includes(term) ||
      item.description?.toLowerCase().includes(term) ||
      item.location?.toLowerCase().includes(term) ||
      item.status?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="p-6 relative w-[90%] mx-auto">
      <h2 className="text-3xl font-bold mb-6 ">Lost & Found Items</h2>

      {/* ✅ Search bar */}
      
      <input
        type="text"
        placeholder="Search for item by title, description, or location..."
        className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Button to show AddItem form */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-6 bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
      >
        {showForm ? "Cancel" : "Add Lost/Found Item"}
      </button>

      {showForm && <AddItem fetchItems={fetchItems} />}

      {/* ✅ Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 ">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden"
          >
            {item.image_url && (
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-48 object-cover border-b cursor-pointer"
                onClick={() => setPreviewImage(item.image_url)} // ✅ show modal
              />
            )}

            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>

              <p className="text-gray-700 text-sm mb-2">{item.description}</p>

              <p className="text-gray-500 text-sm mb-2">
                📍 <span className="font-medium">{item.location}</span>
              </p>

              <p
                className={`text-sm font-bold mb-2 ${
                  item.status === "lost" ? "text-red-500" : "text-green-500"
                }`}
              >
                {item.status?.toUpperCase()}
              </p>

              <p className="text-gray-700 font-medium">
                📞 {item.phone_number}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Full Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="Preview"
            className="max-w-full max-h-full rounded-lg shadow-xl"
          />
        </div>
      )}
    </div>
  );
}

export default ItemsList;
