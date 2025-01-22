import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import Friend from "./friend"

export default function Friends ({user}) {
  return(<div>
    {user && <>
    <Link to={'/users'} >See all users</Link>
    {(user.receivedRequests.length > 0) && <Link to={'/requests'}>{(user.receivedRequests.length > 1)? (<>{user.receivedRequests.length} New Friend Requests</>):(<>1 New Friend Request</>)}</Link>}
    {user.following.map(followed => <div key={followed.id}>
      <Friend user={followed}/>
    </div>)}
    </>}
  </div>)
}

Friends.propTypes = {
  user: PropTypes.object
}