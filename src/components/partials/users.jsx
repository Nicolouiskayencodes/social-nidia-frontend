import PropTypes from "prop-types"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";

export default function Users({me, reload}) {
  const [loading, setLoading] = useState(null);
  const [users, setUsers] = useState(null);
  useEffect(()=>{
      setLoading(true)
      fetch('http://localhost:3000/users', {
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
    console.log(users)
    console.log(me)
  return(<>
  {(loading || !users || !me) ? (<div>loading...</div>) : (<div>
    {users.map(user => <div key={user.id}> {user.id !== me.id && <>
      <img src={user.avatr}/>
      <span>{(user.firstName || user.lastName) ? (<>{user.firstName} {user.lastName}</>):(<>{user.username}</>)}</span>
      {(me.following.some(followed =>(followed.id === user.id))) ? (<span>Following</span>)
      : (me.sentRequests.some(sent=> (sent.id === user.id))) ? (<span>Requested</span>)
    :(<button onClick={()=>follow(user.id)}>Follow</button>)}
      <Link to={`/user/${user.id}`}>Profile</Link>
      </>}</div>)}
  </div>)}
  </>)
}

Users.propTypes = {
  me: PropTypes.object,
  reload: PropTypes.func
}