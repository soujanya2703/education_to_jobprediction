import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [history, setHistory] = useState([]);
    const { user, logoutUser } = useContext(AuthContext);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await api.get('dashboard/');
                setHistory(response.data);
            } catch (error) {
                console.error("Error fetching history", error);
            }
        };
        fetchHistory();
    }, []);

    const handlePredict = async () => {
        try {
            const response = await api.post('predict/');
            // Refresh history
            const historyResponse = await api.get('dashboard/');
            setHistory(historyResponse.data);
            alert(`Prediction: ${response.data.prediction}`);
        } catch (error) {
            console.error("Prediction failed", error);
            alert("Prediction failed. Make sure your profile has GPA and Major.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white shadow-sm border-b border-gray-100 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <Link to="/">
                        <img src="/logo.png" alt="Logo" className="w-10 h-10" />
                    </Link>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                        Edu2Job
                    </span>
                </div>
                <div className="flex items-center space-x-6">
                    <span className="text-gray-600 hidden md:block">Welcome, <b>{user && user.username}</b></span>
                    <Link to="/profile" className="text-gray-600 hover:text-blue-600 font-medium transition">
                        My Profile
                    </Link>
                    <button onClick={logoutUser} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 font-medium transition">
                        Logout
                    </button>
                </div>
            </nav>

            {/* Content */}
            <div className="max-w-6xl mx-auto p-8">
                <header className="mb-10 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Dashboard</h1>
                    <p className="text-gray-500 text-lg">Track your career predictions and progress</p>
                    <button
                        onClick={handlePredict}
                        className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
                    >
                        Predict Career Now
                    </button>
                </header>

                {/* Stats Cards (Placeholder data for now) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-gray-500 text-sm font-semibold uppercase">Total Predictions</h3>
                        <p className="text-3xl font-bold text-gray-800 mt-2">{history.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-gray-500 text-sm font-semibold uppercase">Latest Activity</h3>
                        <p className="text-xl font-bold text-gray-800 mt-2">
                            {history.length > 0 ? new Date(history[0].timestamp).toLocaleDateString() : 'N/A'}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-gray-500 text-sm font-semibold uppercase">Profile Status</h3>
                        {/* Placeholder logic for profile completion */}
                        <p className="text-xl font-bold text-green-600 mt-2">Active</p>
                    </div>
                </div>

                <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
                    <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-800">Prediction History</h2>
                        {/* <button className="text-blue-600 hover:text-blue-800 text-sm font-semibold">View All</button> */}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Result</th>
                                    <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {history.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition">
                                        <td className="px-8 py-5 text-sm text-gray-600 whitespace-nowrap">
                                            {new Date(item.timestamp).toLocaleString()}
                                        </td>
                                        <td className="px-8 py-5 text-sm font-bold text-indigo-600">
                                            {item.prediction_data.result}
                                        </td>
                                        <td className="px-8 py-5 text-sm text-gray-600">
                                            <div className="text-xs">
                                                <span className="font-semibold">GPA:</span> {item.prediction_data.input.gpa} <br />
                                                <span className="font-semibold">Major:</span> {item.prediction_data.input.major} <br />
                                                <span className="font-semibold">Skills:</span> {item.prediction_data.input.skills_score}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {history.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="px-8 py-10 text-center text-gray-500">
                                            <p className="mb-2">No predictions yet.</p>
                                            <button onClick={handlePredict} className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 transition">Make your first prediction!</button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
