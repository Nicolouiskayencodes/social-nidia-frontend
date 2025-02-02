import PropTypes from "prop-types";
import { useRef } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/message.module.css"

function Message({message, user, reload}) {
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false)
  const comment = useRef(null)
  const submitEdit = async () => {
    setLoading(true)
   await fetch(`https://social-nidia.onrender.com/message/${message.id}`, {
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
    await fetch(`https://social-nidia.onrender.com/message/${message.id}`, {
      method: "DELETE", 
      headers: { "Authorization": localStorage.getItem("Authorization"),},
    }
    )
    .then(response => {return response.json()} )
    .then(response=> { console.log(response)})
    setLoading(false)
    reload()
  }

  return(<div className={styles.message}>
    {message.authorId === user.id ? (<>
      {(edit) ? (
        <div className={styles.sent}><img src={message.image} className={styles.image}/><textarea className="editmessage" defaultValue={message.content} ref={comment} ></textarea> 
        <div className={styles.options}>
        {!loading && <button onClick={submitEdit}>Edit</button>}
        <button onClick={()=>setEdit(false)}>Cancel</button>
        </div>
      </div>
      ) : (
        <div className={styles.sent}>
          <img src={message.image} className={styles.image}/> <p>{message.content}</p>
              <Link to={`/user/${message.author.id}`} className={styles.user}><img src={message.author.avatar} className={styles.avatar}/>{message.author.firstName} {message.author.lastName}  <em>{message.author.username}</em></Link>
            <p>{new Date(message.createdAt).toLocaleString()}</p>
      <div className={styles.options}>{(message.content !== null) && <button onClick={()=> setEdit(true)}>Edit</button>}
        {!loading && <button onClick={deleteComment}>Delete</button>}
        </div>
      </div>
      )}
    </>) : (<div className={styles.received}>
        <img src={message.image} className={styles.image}/>
        <p>{message.content}</p>
        <Link to={`/user/${message.author.id}`} className={styles.user}><img src={message.author.avatar} className={styles.avatar}/>{message.author.firstName} {message.author.lastName}  <em>{message.author.username}</em></Link>
        <p>{new Date(message.createdAt).toLocaleString()}</p>
        </div>)}
  </ div>)
}

export default Message;

Message.propTypes = {
  message: PropTypes.object,
  user: PropTypes.object,
  reload: PropTypes.func,
}