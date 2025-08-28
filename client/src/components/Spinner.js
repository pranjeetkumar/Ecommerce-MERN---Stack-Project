import React, { useState, useEffect} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Spinner = ({path = "/login"}) => {

    const [count, setCount] = useState(5);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((prevValue) => --prevValue);
        }, 1000);

        count === 0 && navigate(`${path}`, {
            state: location.pathname,
        });

        // if (count === 0 && localStorage.getItem('auth')) {
        // navigate(path, { state: location.pathname });
        // }
        // else if (count === 0 && !localStorage.getItem('auth')) {
        //     navigate("/login");
        // }


        return () => clearInterval(interval);
    }, [count, navigate, location, path]);


  return (
    <>

        <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
            <h3 className="text-center mb-4">Redirecting in {count} seconds...</h3>
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>

    </>
  )
}

export default Spinner