import { useState, useEffect } from 'react';
import { loginUser } from '../../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function Login() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/projectes");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const resetForm = () => {
    setUser("");
    setPassword("");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await loginUser(user, password);

    if (res.code === undefined) {
      console.log("User logged in successfully:", res.user.uid);
      resetForm();
      return navigate("/projectes");
    } else {
      console.error("Error logging in user:", res.code, res.message);
      alert("Error logging in user: " + res.message);
    }
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
  );
}
