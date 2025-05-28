import { Link } from 'react-router-dom'

console.log("in NAV")

export default function Navbar() {
  return (
    
        <nav>
            <ul>
                <li className="titol"><Link to="/"></Link></li>
                <li><Link to="/">Inici</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
            </ul>
        </nav>
    
  )
}
