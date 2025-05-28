import { useState } from 'react';
import { registerUser, saveCollection } from '../../firebase/firebase';
import { useNavigate } from 'react-router-dom';


export default function Register() {

    const [mail, setMail] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVerify, setPasswordVerify] = useState("");

    const navigate = useNavigate();

    const resetForm = () => {
        setMail("");
        setUserName("");
        setPassword("");
        setPasswordVerify("");
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== passwordVerify) {
            alert("Passwords do not match!");
            return;
        }
        console.log("E-Mail:", mail);
        console.log("Username:", userName);
        console.log("Password:", password);

        const res = await registerUser(mail, password);

        if(res.code == undefined) {
            console.log("User registered successfully:", res.user.uid);
            saveCollection("participants", {
                email: mail,
                username: userName,
                uid: res.user.uid
            }).then((user) => {
                console.log("Participant saved with ID:", user.id, user.username, user.email);
            });
        } else {
            StorageError(res.message)
            // console.error("Error registering user:", res.code, res.message);
            // alert("Error registering user: " + res.message);
            return;
        }

        console.log("User registered:", res);
        // Here you might want to redirect the user or show a success message
        navigate("/projectes");
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
