import React, {useState} from 'react';
import Logo from '../assets/Logo.jpg';
import { FcSearch } from "react-icons/fc";
import { FiUser } from "react-icons/fi";
import { BsCart } from "react-icons/bs";
import { IoIosNotificationsOutline } from "react-icons/io";
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SummaryAPI from '../common';
import { toast } from 'react-toastify';
import { setUserDetails } from '../store/userSlice';

const Header = () => {
  // const [dropdownOpen, setDropdownOpen] = useState(false);

  const [profileMenu, setProfileMenu] = useState(false);

  const dispatch = useDispatch()

  const user = useSelector(state => state?.user?.user) //error to show if not available
  console.log("User", user)

  const handleLogout = async () => {
    const fetchData = await fetch(SummaryAPI.logoutUser.url,{
      method: SummaryAPI.logoutUser.method,
      credentials : 'include'
    })

    const data = await fetchData.json()
    if(data.success){
      toast.success(data.message)
      dispatch(setUserDetails(null))
    }
    if(data.error){
      toast.error(data.message)
    }
  }

  return (
    <header className="h-16 shadow-md bg-white">
      <div className="container mx-auto flex items-center justify-between h-full px-6">
        
        {/* Logo */}
        <Link to ={"/"}>
          <img src={Logo} alt="Logo" className="h-12 cursor-pointer" />
        </Link>

        {/* Search Bar */}
        <div className='hidden lg:flex items-center border rounded-full focus-within:shadow pl-2'>
          <input type="text" placeholder='Search for books' className='w-full outline-none' />
          <div className='min-w-[50px] h-8 flex items-center justify-center bg-slate-300 rounded-r-full'>
            <FcSearch size={20} /> 
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-7 text-gray-700 relative">
        <div className="hidden lg:flex items-center gap-6 text-gray-700 font-medium">
          <span className="cursor-pointer hover:text-blue-500 transition">
            <Link to={"exchanges"}>Exchanges </Link>
          </span>
          <span className="cursor-pointer hover:text-blue-500 transition">Chat</span>
        </div>


          {/* User Dropdown */}
              {/* {dropdownOpen && ( 
                // <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-lg">
                  // <ul className="py-2">
                    // <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
                    // <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-t" onClick={() => alert("Logging out.")}>
                      // Logout
                    // </li>
                  // </ul>
                // </div>
              // )} */}


          <div className='relative flex justify-center'>

            <div className="relative flex justify-center" onClick={()=>setProfileMenu(preve => !preve)}>
              {
                user?.uploadPic?(
                  <img src = {user?.uploadPic} className= 'w-10 h-10 rounded-full' alt={user?.name}/>
                ):
                (
                  <FiUser 
                  size={25} 
                  className="cursor-pointer hover:text-blue-500 transition"
                  // onClick={() => setDropdownOpen(!dropdownOpen)}
              />
                )
              }

              {
                profileMenu && (
                  <div className='absolute bg-white bottom-0 top-11 h-fit p-2 shadow-lg rounded-lg'>
                    <nav>
                      <Link to = {"user-profile"} className='whitespace-nowrap hover:bg-slate-50 p-2'>User Profile</Link>
                    </nav>
                  </div>
                )
              }
            </div>
                
          </div>
          

          <div className='relative'>
            <span>
              <BsCart size={22} className="cursor-pointer hover:text-blue-500 transition" />
            </span>
            <div className='bg-blue-500 text-white w-5 h-5 p-1 flex items-center justify-center rounded-full absolute -top-2 -right-2'>
              <p className='text-sm'>0</p>
            </div>
          </div>
          
          <div className='relative'>
            <span>
              <IoIosNotificationsOutline size={28} className="cursor-pointer hover:text-blue-500 transition" />
            </span>
            <div className='bg-blue-500 text-white w-5 h-5 p-1 flex items-center justify-center rounded-full absolute -top-2 -right-1'>
              <p className='text-sm'>0</p>
            </div>
          </div>
              <div>
                {
                  user?._id ? (
                    <button onClick={handleLogout} className='px-3 py-1 bg-blue-500 rounded-full text-white hover:bg-blue-700'>Logout</button>
                  ) : ( 
                    <Link to={"/login"} className='px-3 py-1 bg-blue-500 rounded-full text-white hover:bg-blue-700'>Login</Link>
                  )
                }
                
              </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
