import { useState } from 'react';


export default function Login() {

  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const resetForm = () => {
    setUser("");
    setPassword("");
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User:", user);
    console.log("Password:", password);
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
