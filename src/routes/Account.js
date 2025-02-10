import { Link } from 'react-router-dom';

function AccountPage() {
    return (
    <>
        <h1>Account Page</h1>
        <p>Go back to <Link to='/'>Home Page</Link>.</p>
    </>
)};

export default AccountPage;