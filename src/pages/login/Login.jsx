import { useState } from 'react';

import { loginUser, logoutUser } from '../../firebase/firebase';
import { useNavigate, Navigate } from 'react-router-dom';


export default function Login() {

  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

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
      //userLoggedIn = true; // Assuming you have a state to track user login status
      // Navigate - Here you might want to redirect the user or show a success message
      return <Navigate to="/" replace />;
      
    } else {
      console.error("Error logging in user:", res.code, res.message);
      alert("Error logging in user: " + res.message);
      return;
    }

    resetForm();
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

      </form>

  )
}
