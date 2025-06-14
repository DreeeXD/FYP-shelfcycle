import { createBrowserRouter } from "react-router-dom"
import App from '../App.jsx'
import Home from '../pages/Home.jsx'
import Login from "../pages/Login.jsx"
import ForgotPassword from "../pages/ForgotPassword.jsx"
import SignUp from "../pages/SignUp.jsx"
import Exchanges from "../pages/Exchanges.jsx"
import UserProfile from "../pages/UserProfile.jsx"
import UserSettings from "../pages/UserSettings.jsx"
import ChatBox from "../pages/Chat.jsx"
import UserUploads from "../pages/UserUploads.jsx"
import Wishlist from "../pages/Wishlist.jsx"
import SearchResults from "../pages/SearchResults.jsx"
import BookDetails from "../pages/BookDetails.jsx"
import PublicUserProfile from "../pages/PublicUserProfile.jsx"
import ResetPassword from "../pages/ResetPassword.jsx"
import VerifyEmail from "../pages/VerifyEmail.jsx"
import UserDashboard from "../components/UserDashboard.jsx"

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {
                path: "/",
                element: <Home/>
            },
            {
                path: "login",
                element: <Login/>
            },
            {
                path: "forgot-password",
                element: <ForgotPassword/>
            },
            {
                path: "signup",
                element: <SignUp/>
            },
            {
                path: "verify-email",
                element: <VerifyEmail />
            },
            {
                path: "exchanges",
                element: <Exchanges/>
            },
            {
                path: "chat",
                element: <ChatBox />
            },
            {
                path: "/chat/:receiverId",
                element: <ChatBox />,
              },
            {
                path: "wishlist",
                element: <Wishlist/>
            },
            {
                path: "forgot-password",
                element: <ForgotPassword />
            },
            {
                path: "reset-password/:token",
                element: <ResetPassword />
            },
            {
                path: "search",
                element: <SearchResults />
            },
            {
                path: "public-profile/:userId",
                element: <PublicUserProfile />
              },
              {
                path: "/user/:userId",
                element: <PublicUserProfile /> 
              },
            {
                path: "book-details/:id",
                element: <BookDetails />
            },
            {
                path: "user-profile",
                element: <UserProfile />,
                children: [
                    {
                        path: "user-settings",
                        element: <UserSettings/>
                    },
                    {
                        index: true,
                        element: <UserDashboard />
                    },
                    {
                        path: "user-uploads",
                        element: <UserUploads/>
                    }
                ]
            }
        ]
    }
])

export default router