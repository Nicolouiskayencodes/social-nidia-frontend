import PropTypes from "prop-types"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"

export default function Header({user}) {
  const navigate = useNavigate()
  const [userState, setUserState] = useState(false)
  const [unread, setUnread] = useState(0)
  useEffect(()=>{
    if (user){
      let unread = 0
      user.conversations.forEach(conversation => {
        if (conversation.readBy.some(person => person.id === user.id)) {
          unread = unread + 0;
        } else {
          unread = unread + 1;
        }
      })
      setUnread(unread)
    }
  }, [user, setUnread])
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
        <Link to={"/conversations"}>Messages {(unread > 0) && <span>({unread})</span>}</Link>
        <button onClick={openUserList}>{user && <img src={user.avatar}></img>}</button> 
        {userState && <div>
          <Link to={"/profile"}>Profile</Link>
          <button onClick={logout}>Logout</button>
          </div>}
        </nav>
    </div>
  )
}

Header.propTypes = {
  user: PropTypes.object
}