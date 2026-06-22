import { createContext, useContext, useState, useEffect } from "react"
import { clearToken, setToken } from "../api/tokenManager"
import authApi from "../api/authApi"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await authApi.refreshToken()
                setUser(response.data)
                setToken(response.data.token)
            }
            catch (error) {
                console.error("Auth check failed", error)
                setUser(null)
                clearToken()
            }
            finally {
                setLoading(false)
            }
        }
        checkAuth()
    }, [])

    const login = (userData) => {

        setUser(userData)
        setToken(userData.token)
    }

    const logout = async () => {
        try {
            await authApi.logout();
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            setUser(null);
            clearToken();
        }
    };

    if (loading) return null
    return (
        <AuthContext.Provider value={{ user, login, logout }} >
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth = () => useContext(AuthContext)
