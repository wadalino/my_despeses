import { loginState, logoutUser } from '../../firebase/firebase';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import './Navbar.css';



export default function Navbar() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  const logout = () => {
    console.log("Logging out user");
    logoutUser()
      .then(() => {
        console.log("User logged out successfully");
        setUserLoggedIn(false);
        // Aquí pots afegir redirecció si vols
      })
      .catch((error) => {
        console.error("Error logging out user:", error);
      });
  };

  useEffect(() => {
    const unsubscribe = loginState((user) => {
      if (user) {
        console.log("User is logged in:", user);
        setUserLoggedIn(true);
      } else {
        console.log("No user is logged in");
        setUserLoggedIn(false);
      }
    });
    return () => unsubscribe(); // Bona pràctica per netejar l'efecte
  }, []);

  return (
    <nav className="navbar">
      <ul>
        <li className="titol"><Link to="/">App Despeses</Link></li>
        <li><Link to="/" className='btn'>Inici</Link></li>
        {!userLoggedIn ? (
          <>
            <li><Link to="/login" className='btn'>Login</Link></li>
            <li><Link to="/register" className='btn'>Register</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/projectes" className='btn'>Projecte</Link></li>
            <li><button onClick={logout} className='btn'>Logout</button></li>
          </>
        )}
      </ul>
    </nav>
  );
}
