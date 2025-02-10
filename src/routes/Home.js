import { Link } from 'react-router-dom';

function HomePage() {
    return (
    <>
        <h1>My Home Page</h1>
        <p>Go to the <Link to='/events'>Events Page</Link>.</p>
    </>
)};

export default HomePage;