import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Header from './components/partials/header'
import Posts from './components/partials/posts'
import Profile from './components/partials/profile'
import './App.css'

function App() {
  const {page, elementid} = useParams();
  useEffect(()=>{
    fetch('http://localhost:3000/post', {
      mode: "cors",
    method: "GET",
    headers: { "Content-Type": "application/json",
    "Authorization": localStorage.getItem("Authorization")},
    })
    .then(response => {
      if (response.status === 200) {
      return response.json();
      }
    })
    .then(response => {
      console.log(response)
    })
  })

  return (
    <>
      <Header />
      {page === 'home' ? (
        <Posts />
      )
      : page === 'profile' ? (
        <Profile />
      ): (<><div>Page not found</div></>)}
    </>
  )
}

export default App
