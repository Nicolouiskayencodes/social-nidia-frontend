import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from './components/partials/header'
import Posts from './components/partials/posts'
import Profile from './components/partials/profile'
import './App.css'
import Conversations from './components/partials/conversations'
import NewConv from './components/partials/newconv'
import Conversation from './components/partials/conversation'
import Friends from './components/partials/friends'
import Users from './components/partials/users'
import User from './components/partials/user'
import Requests from './components/partials/requests'
import MyPages from './components/partials/mypages'
import Pages from './components/partials/pages'
import NewGroup from './components/partials/newgroup'
import Page from './components/partials/page'
import styles from './styles/app.module.css'

function App() {
  const {page, elementid} = useParams();
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [reload, setReload] = useState(false)
  console.log(user)
  useEffect(()=>{
    setReload(false)
    fetch('https://social-nidia.onrender.com/user', {
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
  }, [navigate, reload])

  const childReload = () => {
    setReload(true)
  }

  return (
    <>
      <Header user={user}/>
      <div className={styles.page}>
        <div className={styles.content}>
          {page === 'home' ? (
            <Posts user={user}/>
          )
          : page === 'profile' ? (
            <Profile />
          ): page === 'conversations' ? (
            <Conversations user={user}/>
          ) : page === 'newconv' ? (
            <NewConv me={user} toUser={elementid}/>
          ) : page === 'conversation' ? (
            <Conversation user={user} conversationId={elementid} />
          ) : page === 'users' ? (
            <Users me={user} reload={childReload}/>
          ) : page === 'user' ? (
            <User id={elementid} me={user} reload={childReload}/>
          ) : page === 'requests' ? (
            <Requests user={user} reload={childReload}/>
          ) : page === 'pages' ? (
            <Pages />
          ) : page === 'newgroup' ? (
            <NewGroup />
          ) : page === 'page' ? (
            <Page id={elementid} user={user} reload={childReload}/>
          ) :
          (<><div>Page not found</div></>)}
        </div>
        <div className={styles.sidebar}>
          {user && <Friends user={user} />}
          {user && <MyPages pages={user.groups} />}
        </div>
      </div>
    </>
  )
}

export default App
