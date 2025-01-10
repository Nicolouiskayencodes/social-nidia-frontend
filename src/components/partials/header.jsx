import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"

export default function Header() {
  const navigate = useNavigate()
  const [userState, setUserState] = useState(false)
  const [unread, setUnread] = useState(0)
  const [user, setUser] = useState(null)
  useEffect(()=>{
    fetch('http://localhost:3000/user', {
      mode: "cors",
    method: "GET",
    headers: { "Content-Type": "application/json",
    "Authorization": localStorage.getItem("Authorization")},
    })
    .then(response => {
      if (response.status === 200) {
      return response.json();
      }
    })
    .then(response => {
      console.log(response)
      setUser(response)
      let unread = 0
      response.conversations.forEach(conversation => {
        if (conversation.readBy.some(person => person.id === response.id)) {
          unread = unread +1;
        }
      })
      setUnread(unread)
    })
  }, [setUser, setUnread])
  function openUserList() {
    if (userState === false){
      setUserState(true)
    } else if (userState === true) {
      setUserState(false)
    }
  }
  function logout() {
    localStorage.removeItem("Authorization")
    navigate('/')
  }
  return(
    <div>
      <div>Nidia</div>
      <nav>
        {(user && (user.receivedRequests.length > 0)) && <Link to={"/requests"}>Requests {user.receivedRequests.length}</Link>}
        <Link to={"/home"}>Home</Link>
        <Link to={"/messages"}>Messages {(unread > 0) && <span>({unread})</span>}</Link>
        <button onClick={openUserList}>{user && <img src={user.avatar}></img>}</button> 
        {userState && <div>
          <Link to={"/profile"}>Profile</Link>
          <button onClick={logout}>Logout</button>
          </div>}
        </nav>
    </div>
  )
}