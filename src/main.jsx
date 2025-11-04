import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import './index.css';
import ItemsList from "./ItemsList.jsx"; // ✅ import list page
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "./supabaseClient";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProfilePage from "./ProfilePage";
import HomePage from "./home.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SessionContextProvider supabaseClient={supabase}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/items" element={<ItemsList />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/home" element={<HomePage />} />

        </Routes>
      </BrowserRouter>
    </SessionContextProvider>
  </StrictMode>
);