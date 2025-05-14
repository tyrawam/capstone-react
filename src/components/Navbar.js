import { useAuth } from '../utils/AuthContext';
import logo from '../assets/images/D.png';

function Navbar() {
  const { user, logoutUser } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="/"><img src={logo} style={{ height: '40px', width: '40px' }} /></a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/">Home</a>
            </li>

            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Events
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li><a className="dropdown-item" href="/events/form">Create an Event</a></li>
                <li><a className="dropdown-item" href="/events">Browse Events</a></li>
              </ul>
            </li>
          </ul>
          <div className="d-flex">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Account
                </a>
                {user ? (
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                    <li><a className="dropdown-item" href="/account">My Page</a></li>
                    <li><a className="dropdown-item" href="#" onClick={(e) => {
                      e.preventDefault();
                      logoutUser();
                    }}>Log Out</a></li>
                  </ul>
                ) : (
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                    <li><a className="dropdown-item" href="/register">Create an Account</a></li>
                    <li><a className="dropdown-item" href="/login">Log In</a></li>
                  </ul>
                )}

              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;