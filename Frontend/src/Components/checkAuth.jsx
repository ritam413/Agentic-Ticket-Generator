import { useEffect ,useState } from "react"
import {  useNavigate } from "react-router-dom"


const CheckAuth = ({children,protectedRoute}) => {

  const navigate = useNavigate()
  const [loading,setLoading] = useState(true)
  const [authenticated , setAuthenticated] = useState(false)  

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/checkAuth`, {
          credentials:"include",
          method: "GET",
        })
        
        const data = await res.json();
        setAuthenticated(!!data.user)
      }catch(err){
        setAuthenticated(false)
        console.error(err)
      }finally{
        setLoading(false)
      }
    }
    checkAuth()
  },[])

   // Handle navigation side-effects
  useEffect(() => {
    if (!loading) {
      if (protectedRoute && !authenticated) navigate("/login");
      if (!protectedRoute && authenticated) navigate("/tickets");
    }
  }, [loading, authenticated, protectedRoute, navigate]);

  if (loading)
    return <span className="loading loading-infinity loading-xl">Loading</span>;

  // Wait for useEffect to handle navigation
  if ((protectedRoute && !authenticated) || (!protectedRoute && authenticated))
    return null;

  return children;
}

export default CheckAuth