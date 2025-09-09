import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"
const Signup = () => {
  const [form, setForm] = useState({ email: '', password: "", skills: "", confirmPassword: "" })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSignup = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/signup`,
        {
          method: "POST",
          headers:{
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            ...form,
            skills: form.skills.split(",")
          }),
          credentials: "include"
        })

      const data = await res.json()
      if (res.ok) {
        navigate("/tickets")
      } else {
        alert(data.message || "Signup Failed")
      }
    } catch (error) {
      alert("Signup Failed " + error.message)
    } finally {
      setLoading(false)
    }
  }
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

      {/* The main container now uses the 'dark' theme from DaisyUI.
        This is easily customizable with any other DaisyUI theme like 'night' or 'synthwave'.
      */}
      <div data-theme="dark" className="main-container min-h-screen w-full flex items-center justify-center bg-base-100 ">

        {/* Animated Border Container */}
        <div className="animated-border p-1 rounded-2xl bg-gradient-to-r from-primary via-secondary to-accent">

          <form 
          onSubmit={handleSignup}
          className="max-w-sm w-full mx-auto p-8 rounded-xl bg-base-100 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="brand-title text-4xl font-bold text-primary [text-shadow:0_0_10px_theme(colors.primary)] mb-2">Agentic Systems</h1>
              <p className="text-lg text-base-content/70">Create Your Operator Account</p>
            </div>

            <div className="mb-5">
              <label htmlFor="email" className="text-start block mb-2 text-sm font-medium">Your email</label>
              <input
                type="email"
                id="email"
                name='email'
                value={form.email}
                onChange={handleChange}
                className="input input-bordered w-full transition-all duration-300 hover:border-primary hover:shadow-[0_0_5px_#000,0_0_15px_#00aaff] focus:border-primary focus:shadow-[0_0_5px_#000,0_0_15px_#00aaff]"
                placeholder="operator@protocol.ai"
                required
              />
            </div>

            <div className="mb-5">
              <label htmlFor="password" className="text-start block mb-2 text-sm font-medium">Your password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="input input-bordered w-full transition-all duration-300 hover:border-primary hover:shadow-[0_0_5px_#000,0_0_15px_#00aaff] focus:border-primary focus:shadow-[0_0_5px_#000,0_0_15px_#00aaff]"
                required
              />
            </div>

            <div className="mb-5">
              <label htmlFor="repeat-password" className="block text-start mb-2 text-sm font-medium">Repeat password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="input input-bordered w-full transition-all duration-300 hover:border-primary hover:shadow-[0_0_5px_#000,0_0_15px_#00aaff] focus:border-primary focus:shadow-[0_0_5px_#000,0_0_15px_#00aaff]"
                required
              />
            </div>

            <div className="mb-5">
              <label htmlFor="repeat-password" className="block mb-2 text-start text-sm  font-medium"> Skills </label>
              <input
                type="text"
                id="skills"
                name="skills"
                value={form.skills}
                onChange={handleChange}
                className="input input-bordered w-full transition-all duration-300 hover:border-primary hover:shadow-[0_0_5px_#000,0_0_15px_#00aaff] focus:border-primary focus:shadow-[0_0_5px_#000,0_0_15px_#00aaff]"
                required
              />
            </div>

            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-3">
                <input id="terms" type="checkbox" required className="checkbox  checkbox-primary checked:border-orange-500 checked:bg-orange-400 checked:text-purple-600" />
                <span className="label-text">I agree with the <a href="#" className="link link-hover text-accent">terms and conditions</a></span>
              </label>
            </div>
            <p className="text-sm text-start font-light text-base-content/70  mb-3 mt-2 ">
              Already have an account? <a
                href="#"
                className="ml-1 font-medium text-primary hover:underline"
                onClick={() => navigate('/login')}
              >Login</a>
            </p>
            <button type="submit" className="btn btn-primary w-full transition-all duration-300 hover:shadow-[0_0_10px_#000,0_0_25px_#00aaff]">
              Register New Account
            </button>
          </form>

        </div>
      </div>

    </>
  )
}

export default Signup