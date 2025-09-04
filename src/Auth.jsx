import { useState } from "react";
import { supabase } from "./supabaseClient";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  async function handleSubmit(e) {
    e.preventDefault();

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) console.error("Login error:", error.message);
      else alert("Logged in successfully!");
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) console.error("Signup error:", error.message);
      else alert("Signup successful! please go to your inbox to verify email and login .");
    }
  }

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-2xl font-bold mb-4">
        {isLogin ? "Login" : "Sign Up"}
      </h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 w-80 p-4 border rounded"
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <button type="submit" className="bg-blue-600 text-white py-2 rounded">
          {isLogin ? "Login" : "Sign Up"}
        </button>
      </form>
      <p className="mt-3">
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
