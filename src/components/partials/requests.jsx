import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import styles from "../../styles/requests.module.css"

export default function Requests({user, reload}){

  const reject = async(id) => {
    fetch(`https://social-nidia.onrender.com/unfollow/${id}`, {
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
  const accept = async(id) => {
    fetch(`https://social-nidia.onrender.com/accept/${id}`, {
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

  return(<>
    {user && <div className={styles.requests}>
      {user.receivedRequests.map(request => <div key={request.id} className={styles.request}>
        <span>{(user.firstName || user.lastName) ? (<>{user.firstName} {user.lastName}</>):(<>{user.username}</>)}</span>
        <Link to={`/user/${request.id}`}>Profile</Link>
        <button onClick={()=>reject(request.id)}>Reject Follow Request</button>
        <button onClick={()=>accept(request.id)}>Accept Follow Request</button>
      </div>
      )}
    </div>}
  </>)
}

Requests.propTypes = {
  user: PropTypes.object,
  reload: PropTypes.func
}