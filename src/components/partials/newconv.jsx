import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <>
    <h1>Recipients</h1>
    <ul className="recipient-list">
      {recipients && recipients.map(recipient => <p key={recipients.indexOf(recipient)}>{recipient.displayName || recipient.username} <button onClick={()=>removeRecipient(recipient)}>X</button> </p>)}
    </ul>
    <h1>Add</h1>
    {me && <ul className="user-list">
      {users && users.map(user => <p key={user.id}>{(!recipients.includes(user) && user.id !== me.id) && <button onClick={() => addRecipient(user)} className="add-recipient"><img src={user.avatar || '/avatar.svg'} className="avatar"/> {user.displayName || user.username} +</button>}</p>)}
    </ul>}
    {!loading && <button onClick={startConversation} className="new-conversation">Message</button>}
    </>
    
  )
}


NewConv.propTypes = {
  toUser: PropTypes.string,
  me: PropTypes.object
}