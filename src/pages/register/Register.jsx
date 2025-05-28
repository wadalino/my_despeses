import { useState } from 'react';


export default function Register() {

    const [mail, setMail] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVerify, setPasswordVerify] = useState("");

    const resetForm = () => {
        setMail("");
        setUserName("");
        setPassword("");
        setPasswordVerify("");
    }
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== passwordVerify) {
            alert("Passwords do not match!");
            return;
        }
        console.log("E-Mail:", mail);
        console.log("Username:", userName);
        console.log("Password:", password);
        resetForm();
    }   

    return (

        <form className='despesa-form' onSubmit={handleSubmit}>
            <label>
                <span>E-Mail</span>
                <input type="email" onChange={(e) => setMail(e.target.value)} value={mail} />            
            </label>
            <label>
                <span>Nom</span>
                <input type="usernname" onChange={(e) => setUserName(e.target.value)} value={userName} />
            </label>
            <label>
                <span>Password</span>
                <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} />
            </label>
            <label>
                <span>Re-type password</span>
                <input type="password" onChange={(e) => setPasswordVerify(e.target.value)} value={passwordVerify} />
            </label>
            <button>Registrar</button>
        </form>

    )
}
