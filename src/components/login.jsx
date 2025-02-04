import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from '../styles/login.module.css'

function Login() {
  const username = useRef(null)
  const password = useRef(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  useEffect(()=>{
    if (localStorage.getItem("Authorization")){
      fetch('https://social-nidia.onrender.com/user', {
        mode: "cors",
      method: "GET",
      headers: { "Content-Type": "application/json",
      "Authorization": localStorage.getItem("Authorization")},
      })
      .then(response => {
        if (response.status === 200) {
          setLoading(false)
          navigate('/home');
        } else {
          return setLoading(false)
        }
      })
    } else {
      setLoading(false)
    }
  }, [loading, navigate])
  const submitLogin = async (event) => {
    setLoading(true)
    event.preventDefault();
    await fetch("https://social-nidia.onrender.com/login", {
      mode: "cors",
      method: "POST", body: JSON.stringify({
        username: username.current.value,
        password: password.current.value,
      }),
      headers: { "Content-Type": "application/json" },
    })
    .then(response => {
      return response.json()
    })
    .then(response => {
      console.log(response)
      if (response.message === "Auth Passed") {
        localStorage.setItem("Authorization", `Bearer ${response.token}`)
        navigate('/home');
      }
      setLoading(false)
    })
  }

  return(
    <div className={styles.page}>
      <div className={styles.leftside}>
        <div className={styles.banner}><span className={styles.span1}>N</span><span className={styles.span2}>i</span><span className={styles.span3}>d</span><span className={styles.span4}>i</span><span className={styles.span5}>a</span></div>
      </div>
      <div className={styles.rightside}>
        <form className={styles.form}>
          <div className={styles.field}><label htmlFor="username">Username: </label><input type="text" id="username" ref={username}></input></div>
          <div className={styles.field}><label htmlFor="password">Password: </label><input type="password" id="password" ref={password}></input></div>
          {!loading && <button onClick={submitLogin}>Login</button>}
          {loading && <p>loading...</p>}
        </form>
        <p className={styles.register}>Not a member? <Link to={"/register"}>Register here!</Link></p>
      </div>
    </div>
  )
}

export default Login;