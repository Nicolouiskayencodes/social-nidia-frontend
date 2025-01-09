import { useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom";

export default function Register () {
  const username = useRef(null);
  const password = useRef(null);
  const navigate = useNavigate()
  const confirmPassword = useRef(null)
  const [errors, setErrors] = useState([]);
  const submitRegister = async (event) => {
    event.preventDefault();
    const errors = []
    if (username.current.value.trim() === ''){
      errors.push("Username must contain more than white space")
    }
    if (password.current.value.trim().length < 8) {
      errors.push("Password must be longer than 8 characters")
    }
    if (password.current.value !== confirmPassword.current.value){
      errors.push("Passwords do not match")
    }
    if (errors.length > 0){
      return setErrors(errors)
    } else {
      await fetch("http://localhost:3000/register", {
        mode: "cors",
        method: "POST", body: JSON.stringify({
          username: username.current.value,
          password: password.current.value,
        }),
        headers: { "Content-Type": "application/json" },
      })
      .then(response => {
        if (response.status === 200) {
          return navigate('/')
        }
        return response.json()
      })
      .then(response => {
        errors.push(response.error)
        setErrors(errors)
      })
    }
  }
  return(
    <div>
      <div className="title-card"></div>
      <div className="register">
        {errors.map(error=><p key={errors.indexOf(error)}>{error}</p>)}
        <form>
          <label htmlFor="username">Username: </label><input type="text" id="username" ref={username}></input><br></br>
          <label htmlFor="password">Password: </label><input type="password" id="password" ref={password}></input><br></br>
          <label htmlFor="confirm-password">Confirm Password: </label><input type="password" id="-confirmpassword" ref={confirmPassword}></input><br></br>
          <button onClick={submitRegister}>Register</button>
        </form>
      </div>
      <p>Here by accident? <Link to={'/'}>Back to Login</Link></p>
    </div>
  )
}