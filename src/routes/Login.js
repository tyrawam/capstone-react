import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'
import basketImage from '../assets/images/priscilla-du-preez-A5VAioqUHH4-unsplash.jpg'


const LoginPage = () => {
  const { user, loginUser } = useAuth()
  const navigate = useNavigate()

  const loginForm = useRef(null)

  useEffect(() => {
    if (user) {
      navigate('/events')
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const email = loginForm.current.email.value
    const password = loginForm.current.password.value

    const userInfo = { email, password }

    loginUser(userInfo)
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
                  <h5 className="card-title">Login</h5>

                  <form onSubmit={handleSubmit} ref={loginForm} >

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
                      <div className="d-flex align-items-start"><label className="form-label" id="password">Password:</label></div>
                      <input
                        required
                        className="form-control"
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Enter password..."
                        autoComplete="password"
                      />
                    </div>

                    {/* Submit Button */}
                    <button className="btn btn-primary w-100">Login</button>
                  </form>
                </div>

                <p>Don't have an account? <Link to="/register">Register</Link></p>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LoginPage