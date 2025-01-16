import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default function Conversations({user}) {

  return(
    <>
    <Link to='/newconv' className="start-conversation">Start Conversation</Link>
    {user && <div className="conversations"> {user.conversations.map(conversation => 
    <Link to={`/conversation/${conversation.id}`} key={conversation.id} className={conversation.readBy.some(participant => participant.id === user.id)? ("read") : ("unread")}>{conversation.readBy.some(participant => participant.id === user.id)&& <span>! </span>}{conversation.Users.map(recipient => 
      <span key={recipient.id}>{(user.id !== recipient.id) && <>{recipient.displayName || recipient.username} </>}</span>)}<br/>
    </Link>)}</div>}
  </>
  )
}

Conversations.propTypes = {
  user: PropTypes.object
}