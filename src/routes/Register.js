import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'
import basketImage from '../assets/images/priscilla-du-preez-h0P-00OHYkU-unsplash.jpg'

const RegisterPage = () => {
    const registerForm = useRef(null);
    const { user, registerUser } = useAuth();
    const navigate = useNavigate()

    useEffect(() => {
        if (user) {
            navigate('/')
        }
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();

        const name = registerForm.current.name.value;
        const email = registerForm.current.email.value;
        const password1 = registerForm.current.password1.value;
        const password2 = registerForm.current.password2.value;

        if (password1 !== password2) {
            alert("Passwords do not match");
            return
        }

        const userInfo = { name, email, password1, password2 };
        registerUser(userInfo);
    }

    return (
        <>
            <div className="container d-flex justify-content-center align-items-center mt-5">
                <div className="row flex-fill">
                    <div className="col-md-6 offset-md-3 col-xl-4 offset-xl-4">
                        <div className="card shadow">
                            <div className="card" >
                                <img className="card-img-top" src={basketImage} alt="Card image cap" />
                                <div className="card-body">
                                    <h5 className="card-title">Sign Up</h5>
                                    <form ref={registerForm} onSubmit={handleSubmit} >

                                        {/* Name Input */}
                                        <div className="form-outline mb-2">
                                            <div className="d-flex align-items-start"><label className="form-label" id="name">Name:</label></div>
                                            <input
                                                required
                                                className="form-control"
                                                type="name"
                                                name="name"
                                                id="name"
                                                placeholder="Enter name..."
                                            />
                                        </div>

                                        {/* Email Input */}
                                        <div className="form-outline mb-2">
                                            <div className="d-flex align-items-start"><label className="form-label" id="email">Email:</label></div>
                                            <input
                                                required
                                                className="form-control"
                                                type="email"
                                                name="email"
                                                id="email"
                                                placeholder="Enter email..."
                                            />
                                        </div>

                                        {/* Password Input */}
                                        <div className="form-outline mb-4">
                                            <div className="d-flex align-items-start"><label className="form-label" id="password1">Password:</label></div>
                                            <input
                                                required
                                                className="form-control"
                                                type="password"
                                                name="password1"
                                                id="password1"
                                                placeholder="Enter password..."
                                                autoComplete="password"
                                            />
                                        </div>

                                        <div className="form-outline mb-4">
                                            <div className="d-flex align-items-start"><label className="form-label" id="password2">Confirm Password:</label></div>
                                            <input
                                                required
                                                className="form-control"
                                                type="password"
                                                name="password2"
                                                id="password2"
                                                placeholder="Confirm password..."
                                                autoComplete="password"
                                            />
                                        </div>

                                        {/* Submit Button */}
                                        <button className="btn btn-primary w-100">Sign Up</button>
                                    </form>
                                </div>
                                <p>Already have an account? <Link to="/login">Login</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RegisterPage