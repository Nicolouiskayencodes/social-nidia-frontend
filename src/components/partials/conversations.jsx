import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styles from "../../styles/conversations.module.css"

export default function Conversations({user}) {
  return(
    <div className={styles.conversations}>
    <Link to='/newconv' className={styles.new}>Start Conversation</Link>
    {user && <div className={styles.existing}> {user.conversations.map(conversation => 
    <Link to={`/conversation/${conversation.id}`} key={conversation.id} className={conversation.readBy.some(participant => participant.id === user.id)? ("read") : ("unread")}>{!conversation.readBy.some(participant => participant.id === user.id)&& <span>! </span>}{conversation.Users.map(recipient => 
      <span key={recipient.id}>{(user.id !== recipient.id) && <>{recipient.displayName || recipient.username} </>}</span>)}<br/>
    </Link>)}</div>}
  </div>
  )
}

Conversations.propTypes = {
  user: PropTypes.object
}