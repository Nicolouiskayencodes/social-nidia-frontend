import { useEffect, useState } from "react"
import Post from "./post";
import PropTypes from "prop-types";

export default function Posts({user}){
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
        {posts.map(post => <Post key={post.id} post={post} user={user}/>)}
      </>}
    </div>
  )
}

Posts.propTypes = {
  user: PropTypes.object
}