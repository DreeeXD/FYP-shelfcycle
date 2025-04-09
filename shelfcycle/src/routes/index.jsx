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
                path: "exchanges",
                element: <Exchanges/>
            },
            {
                path: "chat",
                element: <ChatBox />
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
                        path: "user-uploads",
                        element: <UserUploads/>
                    }
                ]
            }
        ]
    }
])

export default router