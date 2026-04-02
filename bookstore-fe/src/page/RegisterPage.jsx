import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../api/authApi";

const RegisterPage = () => {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        fullName: "",
        phone: "",
        address: ""
    });
    const navigate = useNavigate();
    const handleChange = (e) => {        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await authApi.register(form);
            navigate("/login");
        } catch (error) {
            console.error("Registration failed", error);
        }
    };
    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Username"
            />
            <input
                type="email"    
                name="email"
                value={form.email}
                onChange={handleChange} 
                placeholder="Email"
            />
            <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
            />
            <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Full Name"
            />
            <input
                type="text"
                name="phone"    
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone"
            />
            <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Address"
            />
            <button type="submit">Register</button>
        </form>
    );
}
export default RegisterPage;
