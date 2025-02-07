import PropTypes from "prop-types"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import styles from "../../styles/users.module.css"

export default function Users({me, reload}) {
  const [loading, setLoading] = useState(null);
  const [users, setUsers] = useState(null);
  useEffect(()=>{
      setLoading(true)
      fetch('https://social-nidia.onrender.com/users', {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("Authorization"),
        },
      }
      )
      .then(response => {return response.json()} )
      .then(response=> {
        if (response.message === 'Not authenticated') {
          setUsers(null)
        } else {
          setUsers(response)
        }
        setLoading(false)
    })
    }, [reload])
    const follow = async(id) => {
      fetch(`https://social-nidia.onrender.com/follow/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("Authorization"),
        },
      }
      )
      .then(response => {return response.json()} )
      .then(response=> {
        console.log(response)
        reload()
      })
    }
    const deleteUser = async(id) => {
      fetch(`https://social-nidia.onrender.com/user/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("Authorization"),
        },
      }
      )
    }
    console.log(users)
    console.log(me)
  return(<>
  {(loading || !users || !me) ? (<div>loading...</div>) : (<div>
    {users.map(user => <div key={user.id}> {user.id !== me.id && <div className={styles.user}>
      <img src={user.avatar} className={styles.avatar}/>
      <span>{user.firstName} {user.lastName}<em>{user.username}</em></span>
      {(me.following.some(followed =>(followed.id === user.id))) ? (<span>Following</span>)
      : (me.sentRequests.some(sent=> (sent.id === user.id))) ? (<span>Requested</span>)
    :(<button onClick={()=>follow(user.id)}>Follow</button>)}
      <Link to={`/user/${user.id}`}>Profile</Link>
      {(me.id === 1) && <button onClick={deleteUser(user.id)}>Delete</button>}
      </div>}</div>)}
  </div>)}
  </>)
}

Users.propTypes = {
  me: PropTypes.object,
  reload: PropTypes.func
}