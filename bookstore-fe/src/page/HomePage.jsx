import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import authApi from "../api/authApi" 

const HomePage = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            await authApi.logout()
            logout()
            navigate("/login")
        }   
        catch (error) {
            console.error("Logout failed", error)
        }
    }
    return (
        <div>
            <h1>Welcome, {user?.usernameOrEmail || "Guest"}!</h1>
            {user ? (
                <button onClick={handleLogout}>Logout</button>
            ) : (
                <button onClick={() => navigate("/login")}>Login</button>       
            )}
        </div>
    )
}
export default HomePage