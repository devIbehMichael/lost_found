import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import Auth from "./Auth";
import AddItem from "./AddItem";
import ItemsList from "./ItemsList";
import ImageRecognition from "./ImageRecognition";

function App() {
  const [session, setSession] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_evt, sess) => setSession(sess)
    );

    fetchItems(); // load items initially

    return () => subscription.unsubscribe();
  }, []);

  const fetchItems = async () => {
    const { data, error } = await supabase.from("items").select("*");
    if (error) console.error("Error fetching items:", error);
    else setItems(data);
  };

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        Intelligent Lost & Found
      </h1>

      {!session ? (
        <Auth />
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              Signed in as{" "}
              <span className="font-semibold">{session.user.email}</span>
            </p>
            <button
              onClick={handleSignOut}
              className="px-3 py-2 bg-gray-800 text-white rounded"
            >
              Sign out
            </button>
          </div>

          <AddItem fetchItems={fetchItems} />
          <hr className="my-6" />
          
        <ImageRecognition />
        </>
      )}
    </div>
  );
}

export default App;
