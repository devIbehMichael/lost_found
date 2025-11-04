import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user on mount
  useEffect(() => {
    async function fetchUser() {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
        fetchUserItems(data.user.id);
      } else {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  // Fetch items belonging to the logged-in user
  async function fetchUserItems(userId) {
    setLoading(true);
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user items:", error);
    } else {
      setItems(data);
    }
    setLoading(false);
  }

  // Delete an item
  async function handleDelete(id) {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;

    const { error } = await supabase.from("items").delete().eq("id", id);
    if (error) {
      alert("Failed to delete item");
      console.error(error);
    } else {
      setItems(items.filter((item) => item.id !== id));
    }
  }

  // Logout
  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/"; // redirect to homepage
  }

  if (loading) return <p className="p-4">Loading profile...</p>;
  if (!user) return <p className="p-4 text-red-500">Please log in to view your profile.</p>;

  return (
    <div className="m-6 max-w-4xl mx-auto ">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">My Profile</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg shadow mb-6">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>User ID:</strong> {user.id}</p>
      </div>

      <h3 className="text-xl font-semibold mb-4">My Reported Items</h3>

      {items.length === 0 ? (
        <p className="text-gray-600">You haven’t added any items yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition"
            >
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-40 object-cover rounded mb-2"
              />
              <h4 className="font-semibold text-lg">{item.title}</h4>
              <p className="text-sm text-gray-700">{item.description}</p>
              <p className="text-sm text-gray-500 mt-1">
                📍 {item.location}
              </p>
              <p className="text-sm">
                Status:{" "}
                <span
                  className={`font-semibold ${
                    item.status === "Lost" ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {item.status}
                </span>
              </p>

              <button
                onClick={() => handleDelete(item.id)}
                className="mt-3 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
