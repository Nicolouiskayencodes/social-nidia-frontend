import PropTypes from "prop-types"
import { Link } from "react-router-dom"

export default function Requests({user, reload}){

  const reject = async(id) => {
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
  const accept = async(id) => {
    fetch(`http://localhost:3000/accept/${id}`, {
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
    {user && <>
      {user.receivedRequests.map(request => <div key={request.id}>
        <span>{(user.firstName || user.lastName) ? (<>{user.firstName} {user.lastName}</>):(<>{user.username}</>)}</span>
        <Link to={`/user/${request.id}`}>Profile</Link>
        <button onClick={()=>reject(request.id)}>Reject Follow Request</button>
        <button onClick={()=>accept(request.id)}>Accept Follow Request</button>
      </div>
      )}
    </>}
  </>)
}

Requests.propTypes = {
  user: PropTypes.object,
  reload: PropTypes.func
}