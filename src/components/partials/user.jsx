import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Post from "./post";
import styles from "../../styles/profile.module.css"

export default function User({id, me, reload}) {
  const [user, setUser] = useState(null)
  useEffect(()=>{
    fetch(`http://localhost:3000/user/${id}`, {
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
    })
  }, [reload, id, me])
  const follow = async(id) => {
    fetch(`http://localhost:3000/follow/${id}`, {
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
  const unfollow = async(id) => {
    fetch(`http://localhost:3000/unfollow/${id}`, {
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
  return(
    <div className={styles.profile}>{(user && me) && <>
      <div className={styles.info}>
        <img src={user.avatar} className={styles.avatar}></img>
        <div className={styles.bio}>
          <h1>{user.firstName} {user.lastName}</h1>
          <h2>{user.username}</h2>
          <p>{user.bio}</p>
        </div>
      </div>
      <div className={styles.following}>
        {(me.following.some(followed =>(followed.id === user.id))) ? (<span>Following <button onClick={()=>unfollow(user.id)}>Unfollow</button></span>)
        : (me.sentRequests.some(sent=> (sent.id === user.id))) ? (<span>Requested <button onClick={()=>unfollow(user.id)}>Cancel follow request</button></span>)
            :(<button onClick={()=>follow(user.id)}>Follow</button>)}
      </div>
       {user.posts.map(post => <div key={post.id}>{!post.groupId && <Post post={post} user={me} reload={reload}/>}
              </div>)}
    </>}
    </div>)
}

User.propTypes = {
  id: PropTypes.string,
  me: PropTypes.object,
  reload: PropTypes.func
}