import { useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import styles from '../styles/register.module.css'

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
      await fetch("https://social-nidia.onrender.com/register", {
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
    <div className={styles.page}>
       <div className={styles.leftside}>
              <div className={styles.banner}><span className={styles.span1}>N</span><span className={styles.span2}>i</span><span className={styles.span3}>d</span><span className={styles.span4}>i</span><span className={styles.span5}>a</span></div>
            </div>
      <div className={styles.rightside}>
        {errors.map(error=><p key={errors.indexOf(error)}>{error}</p>)}
        <form className={styles.form}>
          <div className={styles.field}><label htmlFor="username">Username: </label><input type="text" id="username" ref={username}></input></div>
          <div className={styles.field}><label htmlFor="password">Password: </label><input type="password" id="password" ref={password}></input></div>
          <div className={styles.field}><label htmlFor="confirm-password">Confirm Password: </label><input type="password" id="-confirmpassword" ref={confirmPassword}></input></div>
          <button onClick={submitRegister}>Register</button>
        </form>
        <p className={styles.login}>Here by accident? <Link to={'/'}>Back to Login</Link></p>
      </div>
    </div>
  )
}