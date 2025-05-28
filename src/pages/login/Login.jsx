import { useState } from 'react';

import { loginUser, logoutUser } from '../../firebase/firebase';
import { Navigate } from 'react-router-dom';


export default function Login() {

  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const resetForm = () => {
    setUser("");
    setPassword("");
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("User:", user);
    console.log("Password:", password);

    const res = await loginUser(user, password);

    if (res.code == undefined) {
      console.log("User logged in successfully:", res.user.uid);
      // Navigate - Here you might want to redirect the user or show a success message
      
    } else {
      console.error("Error logging in user:", res.code, res.message);
      alert("Error logging in user: " + res.message);
      return;
    }

    resetForm();
  }
  const handleLogout = async (e) => {
    e.preventDefault();
    // Implement logout functionality here
    // For example, you can use signOut(auth) from Firebase Auth

    logoutUser().then(() => {
      // Sign-out successful.
      console.log("User logged out successfully now navigating to login page");
    }).catch((error) => {
      // An error happened.
      console.error("Error logging out user:", error);
    });

    return <Navigate to="/login" replace />;
    
  }
  
  return (

      <form className='despesa-form' onSubmit={handleSubmit}>
        <label>
              <span>E-Mail</span>
              <input type="email" onChange={(e) => setUser(e.target.value)} value={user} />
          </label>
          <label>
              <span>Password</span>
              <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} />
          </label>
          <button>Login</button>
          <button onClick={handleLogout}>Logout</button>
      </form>

  )
}
