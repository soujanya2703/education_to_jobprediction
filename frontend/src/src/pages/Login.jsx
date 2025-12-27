import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    let { loginUser, googleLogin } = useContext(AuthContext);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex justify-center items-center font-sans">
            <div className="bg-white p-10 rounded-xl shadow-2xl w-96">
                <div className="flex justify-center mb-6">
                    <Link to="/">
                        <img src="/logo.png" alt="Logo" className="w-16 h-16" />
                    </Link>
                </div>
                <h1 className="text-3xl font-bold text-center mb-10 text-gray-800 tracking-wide">Login</h1>

                <form onSubmit={loginUser}>
                    <div className="mb-8 relative">
                        <input
                            type="text"
                            name="username"
                            className="w-full py-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none text-gray-700 bg-transparent peer placeholder-transparent"
                            placeholder="Username"
                            required
                        />
                        <label className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all 
                                        peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 
                                        peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-500 peer-focus:text-sm">
                            Username
                        </label>
                    </div>

                    <div className="mb-8 relative">
                        <input
                            type="password"
                            name="password"
                            className="w-full py-2 border-b-2 border-gray-300 focus:border-blue-500 outline-none text-gray-700 bg-transparent peer placeholder-transparent"
                            placeholder="Password"
                            required
                        />
                        <label className="absolute left-0 -top-3.5 text-gray-500 text-sm transition-all 
                                        peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 
                                        peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-500 peer-focus:text-sm">
                            Password
                        </label>
                    </div>

                    <div className="flex justify-between items-center mb-8">
                        <span className="text-gray-400 text-sm">Forgot Password?</span>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white font-bold py-3 rounded-full hover:bg-blue-600 transition duration-300 shadow-md uppercase tracking-wide"
                    >
                        Login
                    </button>

                    <div className="mt-6 flex justify-center">
                        <GoogleLogin
                            onSuccess={googleLogin}
                            onError={() => console.log('Login Failed')}
                            type="icon"
                            shape="circle"
                            theme="filled_blue"
                        />
                    </div>
                </form>

                <p className="mt-8 text-center text-sm text-gray-500">
                    Not a member? <Link to="/register" className="text-blue-500 font-semibold hover:underline">Signup</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
