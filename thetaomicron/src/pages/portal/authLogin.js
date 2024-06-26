import {useState, useEffect} from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import apiCall from "../../services/apiCall";


const Auth = ({children}) => {
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            const result = await apiCall('auth', {}, {'Authorization': `Bearer ${token}`});
            setIsAuthenticated(result && result.success);
            if (result.success) localStorage.setItem("token", result.token);
        };
        checkAuth();
    }, [location]);

    if (isAuthenticated === null) return <div>Loading...</div>; // Or some other loading indicator

    // Redirect them to the login page, but save the current location they were trying to go to if not authenticated
    if (!isAuthenticated) {
        if (localStorage.getItem("token")) localStorage.removeItem("token");
        return <Navigate to="/portal/login" state={{ from: location }} replace={true} />;
    }
    
    return children;
};

const PortalLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const location = useLocation();
    const navigate = useNavigate();

    //if token in storage but expired, get rid of it

    // Check if user is already logged in and redirect them accordingly.

    const handleSubmit = async () => {
        if(!email || !password) {
            setErrorMessage("Please enter both email address and password.");
            setPassword('');
            return;
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            setErrorMessage("Please enter a valid email address.");
            setPassword('');
            return;
        }

        const result = await apiCall("login", {email: email, password: password});
        if (!result || !result.success) {
            setErrorMessage(result.error);
            setPassword('');
        } else {
            localStorage.setItem("token", result.token);
            const from = location.state?.from?.pathname ?? "/portal";
            navigate(from, {replace: true});
        }
    };
    
    return (
        <div className='loginContainer'>
            {errorMessage !== "" && <h3 style={{color: 'red'}}>{errorMessage}</h3>}
            <div className='loginForm'>
                <div>
                    <label htmlFor='username'>Username:</label>
                    <input
                    id='username'
                    type='text'
                    placeholder='Username...'
                    value={email}
                    onChange={e=>setEmail(e.target.value)}
                    />
                </div>
                <br/>
                <div>
                    <label htmlFor='password'>Password: </label>
                    <input
                    id="password"
                    type='password'
                    placeholder='Password...'
                    value={password}
                    onChange={e=>setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" onClick={handleSubmit}>Login</button>
            </div>
        </div>
    );
};

export {Auth,PortalLogin};