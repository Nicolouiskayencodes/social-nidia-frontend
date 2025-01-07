import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const username = useRef(null)
  const password = useRef(null)
  const navigate = useNavigate()
  useEffect(()=>{

  })
  const submitLogin = async (event) => {
    event.preventDefault();
    await fetch("http://localhost:3000/login", {
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
    })
  }

  return(
    <div>
      <div className="title-card"></div>
      <div className="login">
        <form>
          <label htmlFor="username">Username: </label><input type="text" id="username" ref={username}></input><br></br>
          <label htmlFor="password">Password: </label><input type="password" id="password" ref={password}></input><br></br>
          <button onClick={submitLogin}>Login</button>
        </form>
        <p>Not a member? <Link to={"/register"}>Register here!</Link></p>
      </div>
    </div>
  )
}

export default Login;