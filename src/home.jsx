import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient.js";
import ImageRecognition from "./ImageRecognition.jsx";
import { Link, useNavigate } from "react-router-dom";
import img1 from "./assets/img1.png";

function HomePage() {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate("/"); // redirect if not logged in
      else setSession(data.session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_evt, sess) => setSession(sess)
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate("/");
  }

  return (
    
    <div className="max-w-7xl mx-auto p-2">

      {session && (
        <>
          <div className="flex flex-row justify-between items-center border-b border-gray-200 p-2">
            <div><img src={img1} alt="" srcset="" /></div>
            <div className="flex flex-row items-center gap-4">
           <a href="/profile"> <p className="text-xs text-gray-600">
              Signed in as{" "}
              <span className="font-semibold">{session.user.email}</span>
            </p></a>
            <button
              onClick={handleSignOut}
              className="px-3 py-2 bg-gray-800 text-white rounded-lg text-xs"
            >
              Sign out
            </button>
          </div>
          </div>
          <ImageRecognition />
        </>
      )}
    </div>
  );
}

export default HomePage;
