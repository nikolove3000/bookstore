import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import authApi from "../api/authApi";

const LoginPage = () => {
  const [form, setForm] = useState({ usernameOrEmail: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authApi.login(form);
      login(response.data);
      navigate("/");
    } catch (error) {
      console.error("Login failed", error);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="usernameOrEmail"
        value={form.usernameOrEmail}
        onChange={handleChange}
        placeholder="Username or Email"
      />
      <input
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
};
export default LoginPage;
