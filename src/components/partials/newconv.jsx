import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/newconv.module.css"

export default function NewConv({toUser, me}){
  const navigate = useNavigate();
  const [users, setUsers] = useState(null);
  const [recipients, setRecipients] = useState([])
  const [loading, setLoading] = useState(false)
  const startConversation = useCallback(() => {
    setLoading(true)
    if (recipients.length > 0){
    fetch('http://localhost:3000/conversation', {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("Authorization"),
      },
      body: JSON.stringify({
        userarray: recipients,
      }),
    }
    )
    .then(response => {return response.json()} )
    .then(response=> {
      const id = response.id;
      setLoading(false)
      navigate(`/conversation/${id}`)
    })
  }
  }, [navigate, recipients]
)
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
        response.forEach(person => {
          if (person.id === parseInt(toUser)){
            setRecipients([person])
            startConversation()
          }
        });
      }
      setLoading(false)
  })
  }, [toUser, startConversation])
  const addRecipient = (user) => {
    if (!recipients.includes(user)) {
      setRecipients([...recipients, user])
    }
  }
  const removeRecipient = (user) => {
    setRecipients(recipients=> recipients.filter(recipient => recipient.id !== user.id))
  }


  return(
    <div className={styles.page}>
    <h1 className={styles.headers}>Recipients</h1>
    <ul className={styles.recipients}>
      {recipients && recipients.map(recipient => <p key={recipients.indexOf(recipient)} className={styles.recipient}>{recipient.displayName || recipient.username} <button onClick={()=>removeRecipient(recipient)}>Remove</button> </p>)}
    </ul>
    <h1 className={styles.headers}>Add</h1>
    {me && <ul className={styles.list}>
      {users && users.map(user => <p key={user.id}>{(!recipients.includes(user) && user.id !== me.id) && <button onClick={() => addRecipient(user)} className={styles.add}><img src={user.avatar} className={styles.avatar}/> {user.displayName || user.username} +</button>}</p>)}
    </ul>}
    {!loading && <button onClick={startConversation}>Create Message</button>}
    </div>
    
  )
}


NewConv.propTypes = {
  toUser: PropTypes.string,
  me: PropTypes.object
}