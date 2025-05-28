import { loginState } from 'firebase/auth';
import { use, useEffect } from 'react';
import { Link } from 'react-router-dom'

console.log("in NAV")

export default function Navbar() {

  const [userLoggedIn, setUserLoggedIn] = useState(false);

  const logout = () => {
    console.log("Logging out user");
    // Implement logout functionality here
    // For example, you can use signOut(auth) from Firebase Auth
    logoutUser().then(() => {
      // Sign-out successful.
      console.log("User logged out successfully now navigating to login page");
      setUserLoggedIn(false);

    }).catch((error) => {
      // An error happened.
      console.error("Error logging out user:", error);
    });
  }


  useEffect(()=>{
    loginState(auth, (user) => {
      if (user) {
        console.log("User is logged in:", user);
        setUserLoggedIn(true);

      } else {
        console.log("No user is logged in");
        setUserLoggedIn(false);
      }
    
  },[]);

  return (
    
        <nav>
            <ul>
                <li className="titol"><Link to="/"></Link></li>
                <li><Link to="/">Inici</Link></li>
                <li>
                ${!userLoggedIn ? (
                  <>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/register">Register</Link></li>
                  </>
                ) : (
                  <li><Link onClick={ ()=> logout()}>Logout</Link></li>
                )}
                </li>
                
                
            </ul>
        </nav>
    
  )
}
