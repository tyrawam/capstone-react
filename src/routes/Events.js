import { Link } from 'react-router-dom';

function EventsPage() {
    return (
    <>
        <h1>The Events Page</h1>
        <p>Go back to <Link to='/'>Home Page</Link>.</p>
    </>
)}

export default EventsPage;