import PropTypes from "prop-types"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import styles from '../../styles/header.module.css'

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
    <div className={styles.header}>
      <div className={styles.logo}><span className={styles.span1}>N</span><span className={styles.span2}>i</span><span className={styles.span3}>d</span><span className={styles.span4}>i</span><span className={styles.span5}>a</span></div>
      <nav className={styles.nav}>
        {(user && (user.receivedRequests.length > 0)) && <Link to={"/requests"}>Requests {user.receivedRequests.length}</Link>}
        <Link to={"/home"}>Home</Link>
        <Link to={"/conversations"}>Messages {(unread > 0) && <span>({unread})</span>}</Link>
        <div className={styles.dropdown}>
        <button onClick={openUserList}>{user && <img src={user.avatar}></img>}</button> 
        {userState && <div className={styles.expand}>
          <div className={styles.expandinner}>
            <Link to={"/profile"} className={styles.dropdownitem}>Profile</Link>
            <button onClick={logout} className={styles.dropdownitem}>Logout</button>
          </div>
          </div>}
          </div>
        </nav>
    </div>
  )
}

Header.propTypes = {
  user: PropTypes.object
}