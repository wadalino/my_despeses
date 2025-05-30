
import { loginState, logoutUser, auth } from '../../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import './Navbar.css';

import useUsernameByUid from '../../hooks/useUsernameByUid';



export default function Navbar() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
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
        console.log("User is logged in:", user.uid);
        setUserLoggedIn(true);
      } else {
        console.log("No user is logged in");
        setUserLoggedIn(false);
      }
    });
    return () => unsubscribe(); // Bona pràctica per netejar l'efecte
  }, []);

  useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
        } else {
          setUser(null);
        }
      });
      return () => unsubscribe();
    }, []);
  // console.log(user);
  const uname = "";
  // uname = useUsernameByUid(user.uid);
  return (
    <nav className="navbar">
      <ul>
        <li className="titol"><Link to="/">App Despeses</Link></li>
        {/*<li><Link to="/" className='btn'>Inici</Link></li>*/}
        {!userLoggedIn ? (
          <>
            <li><Link to="/login" className='btn'>💊 Login</Link></li>
            <li><Link to="/register" className='btn'>😱 Register</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/projectes" className='btn'>⭐ Projectes</Link></li>
            <li><button onClick={logout} className='btn'>{uname} 🔓 Logout</button></li>
          </>
        )}
      </ul>
    </nav>
  );
}
