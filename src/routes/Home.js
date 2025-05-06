import { Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext'

function HomePage() {
    const { user } = useAuth()

    return (
        <div className="vh-100 bg-dark text-white d-flex align-items-center justify-content-start" style={{ backgroundImage: "url('/priscilla-du-preez-HVqJdMdfgic-unsplash.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
            <div className="bg-dark bg-opacity-75 p-5 rounded text-center ms-5">
                <h1 className="mb-4">Welcome to Disc Golf Volunteer</h1>
                <p className="mb-4">Discover, create, and join volunteering events near you!</p>
                <div>
                    { user ? (
                        <Link to="/events" className="btn btn-primary me-3">View Events</Link>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-primary me-3">Log In</Link>
                            <Link to="/register" className="btn btn-secondary">Register</Link>
                        </>
                    )}

                </div>
            </div>
        </div>
    )
};

export default HomePage;