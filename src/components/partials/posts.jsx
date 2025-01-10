import { useEffect, useState } from "react"
import Post from "./post";

export default function Posts(){
  const [posts, setPosts] = useState(null);
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
        setPosts(response)
      })
    }, [setPosts])
  return(
    <div>
      {posts && <>
        {posts.map(post => <Post key={post.id} post={post}/>)}
      </>}
    </div>
  )
}