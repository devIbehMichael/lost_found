import { useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";
import img2 from "./assets/img2.png";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error("Login error:", error.message);
        alert("Login failed: " + error.message);
      } else {
        alert("Logged in successfully!");
        navigate("/home");
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        console.error("Signup error:", error.message);
        alert("Signup failed: " + error.message);
      } else {
        alert("Signup successful! Please check your email to verify your account.");
      }
    }
  }

  return (
    <div className="flex flex-col w-full items-center">
      <h2 className="text-3xl font-semibold mb-8 mt-8 text-center">
        {isLogin ? "Welcome back" : "Create an account"}
      </h2>

      {/* ✅ Responsive wrapper */}
      <div className="flex flex-col md:flex-row md:justify-center md:items-start gap-7 w-full px-4">
        
        {/* ✅ Form Section */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-y-6 p-4 w-full max-w-xs mx-auto md:max-w-sm"
        >
          <div>
            <p className="text-sm">Email:</p>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 rounded-lg w-full border-gray-200 bg-gray-200 text-gray-800 text-xs"
              required
            />
          </div>

          <div>
            <p className="text-sm">Password:</p>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 rounded-lg w-full border-gray-200 bg-gray-200 text-gray-800 text-xs"
              required
            />
          </div>

          <button type="submit" className="bg-blue-500 text-white py-2 rounded-lg shadow hover:bg-blue-600 transition">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        {/* ✅ Image Section - responsive */}
        <div className="w-full max-w-xs mx-auto md:max-w-sm">
          <img
            src={img2}
            alt="illustration"
            className="w-full h-auto rounded-2xl object-cover hidden md:block"
          />
        </div>
      </div>

      {/* ✅ Toggle login/signup */}
      <p className="mt-6 text-center text-sm">
        {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-500 underline"
        >
          {isLogin ? "Sign Up" : "Login"}
        </button>
      </p>
    </div>
  );
}

export default Auth;
