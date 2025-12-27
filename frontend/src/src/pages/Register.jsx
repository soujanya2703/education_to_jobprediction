import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('register/', formData);
            navigate('/login');
        } catch (error) {
            console.error("Registration failed", error);
            alert("Registration failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 flex justify-center items-center p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
                <div className="text-center mb-8">
                    <Link to="/">
                        <img src="/logo.png" alt="Logo" className="w-16 h-16 mx-auto mb-4" />
                    </Link>
                    <h1 className="text-3xl font-extrabold text-gray-900">Create Account</h1>
                    <p className="text-gray-500 mt-2">Join us to start predicting your career</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
                            type="text"
                            name="username"
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition outline-none"
                            placeholder="Choose a username"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition outline-none"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition outline-none"
                            placeholder="Create a strong password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] mt-4"
                    >
                        Sign Up
                    </button>
                </form>

                <p className="mt-8 text-center text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-teal-600 font-semibold hover:underline">
                        Log In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
