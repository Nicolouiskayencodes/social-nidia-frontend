import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from './components/partials/header'
import Posts from './components/partials/posts'
import Profile from './components/partials/profile'
import './App.css'

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
  })

  return (
    <>
      <Header />
      {page === 'home' ? (
        <Posts user={user}/>
      )
      : page === 'profile' ? (
        <Profile />
      ): (<><div>Page not found</div></>)}
    </>
  )
}

export default App
