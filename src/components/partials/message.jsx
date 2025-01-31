import PropTypes from "prop-types";
import { useRef } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

function Message({message, user, reload}) {
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false)
  const comment = useRef(null)
  const submitEdit = async () => {
    setLoading(true)
   await fetch(`http://localhost:3000/message/${message.id}`, {
      method: "PUT", 
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("Authorization"),
    },
      body: JSON.stringify({
        content: comment.current.value,
      }), 
    }
    )
    .then(response => {return response.json()} )
    .then(response=> { console.log(response)})
    setEdit(false)
    setLoading(false)
    reload()
  }
  const deleteComment = async () => {
    setLoading(true)
    await fetch(`http://localhost:3000/message/${message.id}`, {
      method: "DELETE", 
      headers: { "Authorization": localStorage.getItem("Authorization"),},
    }
    )
    .then(response => {return response.json()} )
    .then(response=> { console.log(response)})
    setLoading(false)
    reload()
  }

  return(<>
    {message.authorId === user.id ? (<>
      {(edit) ? (
        <div className="sent"><img src={message.image}/><textarea className="editmessage" defaultValue={message.content} ref={comment} ></textarea> 
        <div className="messageud">
        {!loading && <button onClick={submitEdit}>Edit</button>}
        <button onClick={()=>setEdit(false)}>Cancel</button>
        </div>
      </div>
      ) : (
        <div className="sent">
          <div className="message-content sent-content"><img src={message.image}/> <p>{message.content}</p></div>
          <div className="sent-info">
            <div className="sent-user">
              <Link to={`/user/${message.author.id}`}><img src={message.author.avatar}/>{message.author.firstName} {message.author.lastName}  <em>{message.author.username}</em></Link>
            </div>
            <div><p className="timestamp">{new Date(message.createdAt).toLocaleString()}</p></div>
      <div className="messageud">{(message.content !== null) && <button onClick={()=> setEdit(true)}>Edit</button>}
        {!loading && <button onClick={deleteComment}>Delete</button>}
        </div>
        </div>
      </div>
      )}
    </>) : (<div className="received"><div className="message-content received-content"><img src={message.image}/><p>{message.content}</p></div><div className="received-info"><div className="received-user"><img className="avatar" src={message.author.avatar}/><Link to={`/user/${message.author.id}`}><img src={message.author.avatar}/>{message.author.firstName} {message.author.lastName}  <em>{message.author.username}</em></Link></div><p className="timestamp">{new Date(message.createdAt).toLocaleString()}</p></div></div>)}
  </>)
}

export default Message;

Message.propTypes = {
  message: PropTypes.object,
  user: PropTypes.object,
  reload: PropTypes.func,
}