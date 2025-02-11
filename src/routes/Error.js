import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import classes from '../css/Root.module.css'

function ErrorPage() {
    return(
    <>
        <Navbar />
        <main className={classes.content}>
            <h1>ERROR: Page not found!</h1>
            <p>Go back to <Link to='/'>Home Page</Link>.</p>
        </main>
    </>
)}

export default ErrorPage;