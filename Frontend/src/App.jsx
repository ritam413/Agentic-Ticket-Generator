import { useState } from 'react'
import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import CheckAuth from './Components/checkAuth.jsx'
import Tickets from './pages/tickets.jsx'
import TicketDetailsPage from './pages/ticket.jsx'
import Login from './pages/login.jsx'
import Signup from './pages/signup.jsx'
import Admin from './pages/admin.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route 
          path='/tickets' 
          element={
            <CheckAuth protectedRoute ={true}>
              <Tickets />
            </CheckAuth>
          }
        ></Route>
        <Route 
          path='/' 
          element={
            <CheckAuth protectedRoute ={true}>
              <Tickets />
            </CheckAuth>
          }
        ></Route>
        <Route  
          path='/tickets/:id' 
          element={
            <CheckAuth protectedRoute ={true}>
              <TicketDetailsPage />
            </CheckAuth>
          }
        ></Route>
        <Route  
          path='/login' 
          element={
            <CheckAuth protectedRoute ={false}>
              <Login />
            </CheckAuth>
          }
        ></Route>
        <Route  
          path='/signup' 
          element={
            <CheckAuth protectedRoute ={false}>
              <Signup />
            </CheckAuth>
          }
        ></Route>
        <Route  
          path='/admin' 
          element={
            <CheckAuth protectedRoute ={true}>
              <Admin />
            </CheckAuth>
          }
        ></Route>
      </Routes>
    </>
  )
}

export default App
