import React from 'react';
import { useNavigate } from 'react-router-dom'; // Removed to fix crash in this environment
import { useState } from 'react';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Removed to fix crash in this environment

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form),
        credentials: "include",
        
      });

      const data = await res.json();
      if (!data.error) {
        navigate("/tickets"); 
        console.log("Login successful! Would navigate to '/tickets'");
      } else {
        alert(data.error || "Login Failed");
      }
    } catch (error) {
      alert("Login Failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* A small style block is necessary for the animated gradient border, 
        as this effect is too complex for Tailwind's utility classes alone.
      */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Rajdhani:wght@400;700&display=swap');

        .animated-border {
          background-size: 200% 200%;
          animation: gradient-animation 4s ease infinite;
        }

        @keyframes gradient-animation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .brand-title {
          font-family: 'Orbitron', sans-serif;
        }
        
        body, .main-container {
           font-family: 'Rajdhani', sans-serif;
        }
      `}</style>

      {/* The main container uses the 'dark' theme from DaisyUI for a consistent look. */}
      <div data-theme="dark" className="main-container min-h-screen w-full flex items-center justify-center bg-base-100 p-4">

        {/* Animated Border Container */}
        <div className="animated-border p-1 rounded-2xl bg-gradient-to-r from-primary via-secondary to-accent">

          <form onSubmit={handleLogin} className="max-w-sm w-full mx-auto p-8 rounded-xl bg-base-100 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="brand-title text-4xl font-bold text-primary [text-shadow:0_0_10px_theme(colors.primary)] mb-2">Agentic Systems</h1>
              <p className="text-lg text-base-content/70">Login to Your Operator Account</p>
            </div>

            <div className="mb-5">
              <label htmlFor="email" className="block mb-2 text-sm font-medium">Your email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="input input-bordered w-full transition-all duration-300 hover:border-primary hover:shadow-[0_0_5px_#000,0_0_15px_#00aaff] focus:border-primary focus:shadow-[0_0_5px_#000,0_0_15px_#00aaff]"
                placeholder="operator@protocol.ai"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-5">
              <label htmlFor="password" className="block mb-2 text-sm font-medium">Your password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="input input-bordered w-full transition-all duration-300 hover:border-primary hover:shadow-[0_0_5px_#000,0_0_15px_#00aaff] focus:border-primary focus:shadow-[0_0_5px_#000,0_0_15px_#00aaff]"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex items-center justify-end mb-5">
              <a href="/signup"
              onClick={(e)=>{e.preventDefault();navigate('/signup')}}
              className="text-sm font-medium text-accent hover:underline">Forgot password?</a>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full transition-all duration-300 hover:shadow-[0_0_10px_#000,0_0_25px_#00aaff]"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Logging in...
                </>
              ) : "Login"}
            </button>

            <p className="text-sm text-center font-light text-base-content/70 mt-6">
              Don’t have an account yet? <a
                href="#"
                className="font-medium text-primary hover:underline"
                onClick={() => navigate('/signup')}
              >Sign up</a>
            </p>
          </form>

        </div>
      </div>
    </>
  );
}

export default Login;

