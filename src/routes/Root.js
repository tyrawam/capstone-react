// Outlet marks where the child route elements (found in App.js router array) should be rendered to
// Enables rendering of Navbar on each route
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.js';

function RootLayout() {
    return (
    <>
        <Navbar />
        <main>
            <Outlet />
        </main>        
    </>
)}

export default RootLayout;