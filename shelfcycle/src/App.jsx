import { Outlet } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import { ToastContainer } from 'react-toastify';
import SummaryAPI from './common';
import { useEffect } from 'react';
import Context from './context';
import { useDispatch } from 'react-redux';
import { setUserDetails } from './store/userSlice';
function App() {

  const dispatch = useDispatch()

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

    if(dataAPI.success){
      dispatch(setUserDetails(dataAPI.data))
    }

    console.log("user data", dataResponse)
  }

  useEffect(() => {
     //User details
    fetchUserDetails()

  }, [])
  return (
    <>
      <Context.Provider value = {{
        fetchUserDetails //fetching user details
      }}>

        <ToastContainer />
        <Header/>    
        <main>
          <Outlet/>
        </main>
        <Footer/>

      </Context.Provider>
    </>
  )
}

export default App
 