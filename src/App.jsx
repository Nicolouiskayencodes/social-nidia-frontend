import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from './components/partials/header'
import Posts from './components/partials/posts'
import Profile from './components/partials/profile'
import './App.css'
import Conversations from './components/partials/conversations'
import NewConv from './components/partials/newconv'
import Conversation from './components/partials/conversation'

function App() {
  const {page, elementid} = useParams();
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  useEffect(()=>{
    fetch('http://localhost:3000/user', {
      mode: "cors",
    method: "GET",
    headers: { "Content-Type": "application/json",
    "Authorization": localStorage.getItem("Authorization")},
    })
    .then(response => {
      if (response.status === 401) {
      navigate('/')
      }
      if(response.status === 200) {
        return response.json()
      }
    })
    .then(response =>{
      setUser(response)
    })
  }, [navigate])

  return (
    <>
      <Header user={user}/>
      {page === 'home' ? (
        <Posts user={user}/>
      )
      : page === 'profile' ? (
        <Profile />
      ): page === 'conversations' ? ( 
        <Conversations user={user}/> 
      ) : page === 'newconv' ? (
        <NewConv />
      ) : page === 'conversation' ? (
        <Conversation user={user} conversationId={elementid} />
      ) :
      (<><div>Page not found</div></>)}
    </>
  )
}

export default App
