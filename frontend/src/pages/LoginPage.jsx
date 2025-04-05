import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../context/AuthContext";

const LoginPage = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [isChecked, setIsChecked] = useState(false); // State for the "Remember me" checkbox

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked); // Toggle checkbox state
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("http://127.0.0.1:5000/login", formData, {
                headers: { "Content-Type": "application/json" }
            });

            const data = response.data;

            if (response.status !== 200) {
                throw new Error(data.msg || "Connexion échouée");
            }

            login(data.access_token, { username: formData.username, role: data.role });
            
            if (data.role === "admin") navigate("/dashboard");
            else navigate("/home");

            
        } catch (err) {
            setError(err.response?.data?.msg || "Erreur lors de la connexion");
        }
    };

    return (
        <main className="d-flex w-100">
            <div className="container d-flex flex-column">
                <div className="row vh-100">
                    <div className="col-sm-10 col-md-8 col-lg-6 col-xl-5 mx-auto d-table h-100">
                        <div className="d-table-cell align-middle">

                            <div className="text-center mt-4">
                                <h1 className="h2">Welcome back!</h1>
                                <p className="lead">Sign in to your account to continue</p>
                            </div>

                            <div className="card">
                                <div className="card-body">
                                    <div className="m-sm-3">
                                        {error && <p className="alert alert-danger">{error}</p>}
                                        <form onSubmit={handleSubmit}>
                                            <div className="mb-3">
                                                <label className="form-label">Username</label>
                                                <input className="form-control form-control-lg" type="text" name="username" placeholder="Enter your username" onChange={handleChange} required />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Password</label>
                                                <input className="form-control form-control-lg" type="password" name="password" placeholder="Enter your password" onChange={handleChange} required />
                                            </div>
                                            <div>
                                                <div className="form-check align-items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={handleCheckboxChange} // Toggle checkbox
                                                    />
                                                    <label className="form-check-label text-small" htmlFor="customControlInline">Remember me</label>
                                                </div>
                                            </div>
                                            <div className="d-grid gap-2 mt-3">
                                                <button type="submit" className="btn btn-lg btn-primary">Sign in</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            {/* <div className="text-center mb-3">
                                Don't have an account? <a href="/register">Sign up</a>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default LoginPage;
