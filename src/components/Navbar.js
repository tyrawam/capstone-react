import { NavLink, Link, Navigate, useNavigate } from 'react-router-dom';
import classes from '../css/Navbar.module.css';
import { useAuth } from '../utils/AuthContext';


function Navbar() {

  const navigate = useNavigate();

  const { user, logoutUser } = useAuth(); // Destructure user from useAuth hook

  return (
  <header className={classes.header}>
    <nav>      
      <ul className={classes.list}>
        {user ? (
        <>
          <li>
            <NavLink to="/" className={({isActive}) => isActive ? classes.active : undefined}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/events" className={({isActive}) => isActive ? classes.active : undefined}>
              Events
            </NavLink>
          </li>
          <li>
            <NavLink to="/account" className={({isActive}) => isActive ? classes.active : undefined}> 
              Account
            </NavLink>
          </li>
          <li>
            <button onClick={logoutUser}>Logout</button>
          </li>
        </>) : (
          <NavLink to="/login">Login</NavLink>
        )}
      </ul>
    </nav>
  </header>
)}

export default Navbar;