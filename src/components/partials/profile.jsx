import { useEffect, useState } from "react";
import Post from "./post";

export default function Profile() {
  const [user, setUser] = useState(null)
    useEffect(()=>{
      fetch('http://localhost:3000/user', {
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
        setUser(response)
      })
    }, [setUser])
  return(
    <div>{user && <>
      <img src={user.avatar}></img>
      <h1>{user.firstName} {user.lastName}</h1>
      <h2>{user.username}</h2>
      <p>{user.bio}</p>
      {user.posts.map(post => <div key={post.id}>{!post.groupId && <Post post={post}/>}
        </div>)}
    </>}
    </div>
  )
}