import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const RegisterScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register, loading, error } = useAuth();
    const [adminHint, setAdminHint] = useState(false);
    const navigate = useNavigate();
    const [message, setMessage] = useState(null);

    const submitHandler = async (e) => {
        e.preventDefault();
        setMessage(null);
        
        // Ensure password complexity check here for extra points!
        
        const result = await register(name, email, password);
        
        if (result.success) {
            setMessage(result.message);
            // Optionally redirect to login after a short delay
            setTimeout(() => navigate('/login'), 3000); 
        } else {
            setMessage(result.message);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }} className="animate-fadeIn">
            <h2 className="animate-slideUp">Register Account</h2>
            {message && <p style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <form onSubmit={submitHandler}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Name</label>
                    <input
                        type="text"
                        placeholder="Enter name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Email Address</label>
                    <input
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Password</label>
                    <input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <input type="checkbox" checked={adminHint} onChange={(e) => setAdminHint(e.target.checked)} />
                    <span>I'm an admin (you still need an admin-assigned account)</span>
                </label>
                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ 
                        width: '100%', 
                        padding: '10px', 
                        backgroundColor: loading ? '#ccc' : '#007bff', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '5px'
                    }}
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
            <div style={{ marginTop: '15px', textAlign: 'center' }}>
                Have an Account? <Link to="/login">Login</Link>
            </div>
        </div>
    );
};

export default RegisterScreen;