import { useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";
import { div } from "@tensorflow/tfjs";
import img2 from "./assets/img2.png"
function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate(); // ✅ must be inside component

  async function handleSubmit(e) {
    e.preventDefault();

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error("Login error:", error.message);
        alert("Login failed: " + error.message);
      } else {
        alert("Logged in successfully!");
        navigate("/home"); // ✅ redirect to homepage after login
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
     <div className="flex flex-col items-center w-full"> 
      <h2 className="text-4xl font-semibold mb-14 flex flex-row justify-center mt-10">
        {isLogin ? "Welcome back " : "Create and account"}
      </h2>
    <div className=" flex flex-row justify-center gap-12">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-y-6 p-4 "
      >
        <div>
        <p className="text-sm">Email:</p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded-lg w-80 border-gray-200 text-gray-800 bg-gray-200 text-xs"
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
          className="border p-2 rounded-lg w-80 border-gray-200 text-gray-800 bg-gray-200 text-xs"
          required
        />
        </div>
        <button type="submit" className="bg-blue-400 text-white py-2 rounded">
          {isLogin ? "Login" : "Sign Up"}
        </button>
      </form>

<div>
  <img src={img2} alt=""  className="w-sm rounded-2xl"/>
</div>
      </div>
      <p className="mt-6 flex flex-row justify-center">
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
