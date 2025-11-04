import { Routes, Route } from "react-router-dom";
import LoginPage from "./login.jsx";
import HomePage from "./home.jsx";

function App() {
  return (
    
      <Routes>
        <Route path="*" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    
  );
}

export default App;
