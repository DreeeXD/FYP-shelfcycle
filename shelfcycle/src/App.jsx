import { Outlet } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import { ToastContainer } from 'react-toastify';
import SummaryAPI from './common';
import { useEffect } from 'react';
function App() {

  const fetchUserDetails = async () => {

    const dataResponse = await fetch (SummaryAPI.currentUser.url, {
      method: SummaryAPI.currentUser.method,
      credentials : "include",  //this will take the cookies token,, if not included then token will not be sent to backend
    //   headers: {
    //     "Content-Type": "application/json",
    // }
    })

    // const contentType = dataResponse.headers.get("content-type");
    //     if (!contentType || !contentType.includes("application/json")) {
    //         throw new Error("Invalid response format. Expected JSON.");
    //     }

    const dataAPI = await dataResponse.json()

    console.log("user data", dataResponse)
  }

  useEffect(() => {
     //User details
    fetchUserDetails()

  }, [])
  return (
    <>
      <ToastContainer />
      <Header/>    
      <main>
      <Outlet/>
      </main>
      <Footer/>
    </>
  )
}

export default App
 