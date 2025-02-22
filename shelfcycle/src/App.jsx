import { Outlet } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import { ToastContainer } from 'react-toastify';
function App() {
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
 