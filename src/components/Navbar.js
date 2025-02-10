import { Link } from 'react-router-dom';

function Navbar() {
  return (
  <header>
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/events">Events</Link></li>
        <li><Link to="/account">Account</Link></li>
      </ul>
    </nav>
  </header>
)}

export default Navbar;