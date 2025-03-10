import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import Message from "./message";
import styles from "../../styles/conversation.module.css"

export default function Conversation({conversationId, user}) {
  const [messages, setMessages] = useState(null)
  const [recipients, setRecipients]= useState(null)
  const [reload, setReload] = useState(false)
  const [sending, setSending] = useState(false)
  const newMessage = useRef(null);
  const photo = useRef(null);
  useEffect(()=>{
    setReload(false)
    setSending(false)
    fetch(`https://social-nidia.onrender.com/conversation/${conversationId}`, {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("Authorization"),
      },
    }
    )
    .then(response => {return response.json()} )
    .then(response=> {
      setMessages(response.Messages)
      setRecipients(response.Users)
    })
  }, [conversationId, reload])
  const submitMessage = async (event) => {
    if (sending === false) {
    event.preventDefault();
    setSending(true)
    const formData = new FormData()
    if (photo.current.files[0]){ 
      formData.append('file', photo.current.files[0])
    }
    if (newMessage.current.value) { 
      formData.append('content', newMessage.current.value)
    }
    if (photo.current.files[0] ||newMessage.current.value ){
      await fetch(`https://social-nidia.onrender.com/message/${conversationId}`, {
        headers: { "Authorization": localStorage.getItem("Authorization"),},
        method: "POST", 
        body: formData, 
      })
      .then(response => {return response.json()} )
      .then(response=> { console.log(response)})
    }
    newMessage.current.value = null
    photo.current.value = null
    setSending(true)
    setReload(true)
  }
  }
  const childReload= () => setReload(true)
  return(<div className={styles.page}>
  <h1 className={styles.title}>{(recipients && user) && recipients.map(recipient => <span key={recipient.id} >{recipient.id !== user.id && <div className={styles.recipient}>{recipient.firstname} {recipient.lastname} <em>{recipient.username}</em></div>}</span>)}</h1>
    <div>
    <div><div >{(messages && user)  && messages.map(message => <Message key={messages.indexOf(message)} message={message} user={user} reload={childReload}/>)}</div>
    <form onSubmit={submitMessage} className={styles.new}><input type="file" ref={photo} name="picture"></input><input type="text" ref={newMessage} name="content" className={styles.newtext}></input>
    {!sending &&<button type="submit" className="submit">Send</button>}</form>
    {sending && <p>loading...</p>}
    </div>
    </div>
    </div>)
}

Conversation.propTypes = {
  conversationId: PropTypes.string,
  user: PropTypes.object
}