import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { DEGREES, SPECIALIZATIONS, CGPA_RANGES, YEARS, STATES, getColleges } from '../data/educationOptions';

const Profile = () => {
    const [profile, setProfile] = useState({});
    const [gpa, setGpa] = useState('');
    const [major, setMajor] = useState('');
    const [education, setEducation] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);

    // New Entry States
    const [newEdu, setNewEdu] = useState({ degree: '', specialization: '', institution: '', cgpa: '', year: '' });
    const [selectedState, setSelectedState] = useState('');
    const [newCert, setNewCert] = useState({ name: '', issuer: '', year: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('profile/');
                setProfile(response.data);

                const info = response.data.academic_info || {};
                setGpa(info.gpa || '');
                setMajor(info.major || '');
                setEducation(info.education || []);
                setCertificates(info.certificates || []);
            } catch (error) {
                console.error("Error fetching profile", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async () => {
        const academic_info = {
            gpa,
            major,
            education,
            certificates
        };
        try {
            const response = await api.put('profile/', { academic_info });
            console.log("Save Response:", response.data);
            setProfile(response.data); // Update local state with server response
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Save error", error);
            alert("Failed to update profile.");
        }
    };

    const addEducation = () => {
        // Validation
        if (!newEdu.degree || !newEdu.institution || !newEdu.year) {
            alert("Please fill in Degree, Institution and Year.");
            return;
        }
        // CGPA range validation not needed as it's a dropdown, but check empty
        if (!newEdu.cgpa) {
            alert("Please select a CGPA range.");
            return;
        }

        setEducation([...education, newEdu]);
        setNewEdu({ degree: '', specialization: '', institution: '', cgpa: '', year: '' });
        setSelectedState('');
    };

    const removeEducation = (index) => {
        const updated = education.filter((_, i) => i !== index);
        setEducation(updated);
    };

    const addCertificate = () => {
        if (newCert.name && newCert.issuer) {
            setCertificates([...certificates, newCert]);
            setNewCert({ name: '', issuer: '', year: '' });
        }
    };

    const removeCertificate = (index) => {
        const updated = certificates.filter((_, i) => i !== index);
        setCertificates(updated);
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-8 border-b border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">Edit Profile</h1>
                        <Link to="/dashboard" className="text-blue-600 hover:text-blue-800 font-semibold flex items-center">
                            &larr; Back to Dashboard
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Username</label>
                            <input type="text" value={profile.username || ''} disabled
                                className="w-full p-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 font-medium" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                            <input type="text" value={profile.email || ''} disabled
                                className="w-full p-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-700 font-medium" />
                        </div>
                    </div>
                </div>

                <div className="p-8 bg-white border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-3">Academic Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Major / Field of Study</label>
                            <input
                                type="text"
                                value={major}
                                onChange={(e) => setMajor(e.target.value)}
                                placeholder="e.g. Computer Science"
                                className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">CGPA (Scale of 10)</label>
                            <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="10.0"
                                value={gpa}
                                onChange={(e) => setGpa(e.target.value)}
                                placeholder="e.g. 8.5"
                                className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-8 bg-gray-50/50">
                    {/* Education Section */}
                    <div className="mb-10">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-blue-500 pl-3">Education</h2>

                        {education.map((edu, index) => (
                            <div key={index} className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm mb-3 border border-gray-100">
                                <div>
                                    <h4 className="font-bold text-gray-800">{edu.degree} <span className="text-gray-500 font-normal">{edu.specialization ? `in ${edu.specialization}` : ''}</span></h4>
                                    <p className="text-gray-600 text-sm">{edu.institution} • {edu.year} {edu.cgpa ? `• CGPA: ${edu.cgpa}` : ''}</p>
                                </div>
                                <button onClick={() => removeEducation(index)} className="text-red-500 hover:text-red-700 text-sm font-semibold">Remove</button>
                            </div>
                        ))}

                        <div className="bg-white p-5 rounded-lg border border-gray-200 mt-4">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Add New Education</h3>
                            <div className="grid grid-cols-1 gap-3 mb-3">
                                {/* Degree & Specialization */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <select className="p-2 border rounded" value={newEdu.degree} onChange={e => setNewEdu({ ...newEdu, degree: e.target.value })}>
                                        <option value="">Select Degree</option>
                                        {DEGREES.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>

                                    <select className="p-2 border rounded" value={newEdu.specialization} onChange={e => setNewEdu({ ...newEdu, specialization: e.target.value })}>
                                        <option value="">Select Specialization</option>
                                        {Object.entries(SPECIALIZATIONS).map(([group, specs]) => (
                                            <optgroup label={group} key={group}>
                                                {specs.map(s => <option key={s} value={s}>{s}</option>)}
                                            </optgroup>
                                        ))}
                                    </select>
                                </div>

                                {/* State & College */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <select className="p-2 border rounded" value={selectedState} onChange={e => setSelectedState(e.target.value)}>
                                        <option value="">Select State (for College)</option>
                                        {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>

                                    <select className="p-2 border rounded" value={newEdu.institution} onChange={e => setNewEdu({ ...newEdu, institution: e.target.value })} disabled={!selectedState}>
                                        <option value="">Select Institution</option>
                                        {selectedState && getColleges(selectedState).map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>

                                {/* CGPA & Year */}
                                <div className="grid grid-cols-2 gap-2">
                                    <select className="p-2 border rounded" value={newEdu.cgpa} onChange={e => setNewEdu({ ...newEdu, cgpa: e.target.value })}>
                                        <option value="">Select CGPA Range</option>
                                        {CGPA_RANGES.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>

                                    <select className="p-2 border rounded" value={newEdu.year} onChange={e => setNewEdu({ ...newEdu, year: e.target.value })}>
                                        <option value="">Year of Grad</option>
                                        {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                            </div>
                            <button onClick={addEducation} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium transition">
                                + Add Education
                            </button>
                        </div>
                    </div>

                    {/* Certificates Section */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-green-500 pl-3">Certificates</h2>

                        {certificates.map((cert, index) => (
                            <div key={index} className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm mb-3 border border-gray-100">
                                <div>
                                    <h4 className="font-bold text-gray-800">{cert.name}</h4>
                                    <p className="text-gray-600 text-sm">{cert.issuer} • {cert.year}</p>
                                </div>
                                <button onClick={() => removeCertificate(index)} className="text-red-500 hover:text-red-700 text-sm font-semibold">Remove</button>
                            </div>
                        ))}

                        <div className="bg-white p-5 rounded-lg border border-gray-200 mt-4">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Add New Certificate</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                                <input placeholder="Certificate Name" value={newCert.name} onChange={e => setNewCert({ ...newCert, name: e.target.value })} className="p-2 border rounded" />
                                <input placeholder="Issuer" value={newCert.issuer} onChange={e => setNewCert({ ...newCert, issuer: e.target.value })} className="p-2 border rounded" />
                                <input placeholder="Year" value={newCert.year} onChange={e => setNewCert({ ...newCert, year: e.target.value })} className="p-2 border rounded" />
                            </div>
                            <button onClick={addCertificate} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-medium transition">
                                + Add Certificate
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-gray-100 border-t border-gray-200 flex justify-end">
                    <button onClick={handleSave} className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 font-bold shadow-md transition transform hover:scale-105">
                        Save Profile Changes
                    </button>
                </div>
            </div>
        </div >
    );
};

export default Profile;
