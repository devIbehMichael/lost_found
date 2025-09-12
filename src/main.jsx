import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./output.css";
import App from "./App.jsx";
import ItemsList from "./ItemsList.jsx"; // ✅ import list page
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "./supabaseClient";
import { BrowserRouter, Routes, Route } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SessionContextProvider supabaseClient={supabase}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/items" element={<ItemsList />} />
        </Routes>
      </BrowserRouter>
    </SessionContextProvider>
  </StrictMode>
);