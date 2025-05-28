import { Link } from "react-router-dom"
import './Navbar.css'

export default function Navbar() {
  return (
    <nav className="navbar">
        <ul>
        <li className="titol"><Link to="/">Despesapp</Link></li>
        <li><Link to="/">Inici</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/register">Register</Link></li>
        </ul>
    </nav>
  )
}
