import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styles from "../../styles/friend.module.css"

export default function Friend({user}) {
  const now = new Date()
  const timeout = new Date(now.getTime() - (5*60*1000))
  return (
    <div className={styles.friend}>
      <div className={styles.name}>
        <span>{(user.firstName || user.lastName) ? (<>{user.firstName} {user.lastName}</>):(<>{user.username}</>)}</span>
        {(new Date(user.lastActive) > timeout) && <span> active</span>}
      </div>
      <div className={styles.links}>
        <Link to={`/user/${user.id}`}>Profile</Link>
        <Link to={`/newconv/${user.id}`}>Message</Link>
      </div>
    </div>
  )
}

Friend.propTypes = {
  user: PropTypes.object
}