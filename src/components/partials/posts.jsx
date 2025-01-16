import { useEffect, useRef, useState } from "react"
import Post from "./post";
import PropTypes from "prop-types";

export default function Posts({user}){
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(false)
  const [reload, setReload] = useState(false);
  const postContent = useRef(null)
  const photo = useRef(null);
  useEffect(()=>{
    setReload(false)
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
    }, [setPosts, reload])
  function createPost() {
    if (!loading){
    setLoading(true)
    const formData = new FormData()
    if (photo.current.files[0]){ 
      formData.append('file', photo.current.files[0])
    }
    if (postContent.current.value) { 
      formData.append('content', postContent.current.value)
    }
    if (photo.current.files[0] ||postContent.current.value ){
    fetch('http://localhost:3000/post', {
      mode: "cors",
      method: "POST",
      headers: {
      "Authorization": localStorage.getItem("Authorization")},
      body: formData
      })
      .then(response => {
        setLoading(false)
        if (response.status === 200) {
        postContent.current.value = null;
        photo.current.value = null;
        }
      })
    }
  }
  }
    function childReload(){
      setReload(true)
    }
  return(
    <div>
      <form>
        <label htmlFor="post-content">What&apos;s on your mind?</label>
        <input type="file" ref={photo} name="picture"></input>
        <input type="text" ref={postContent} id="post-content"></input>
        <button onClick={createPost}>Post</button>
      </form>
      {posts && <>
        {posts.map(post => <Post key={post.id} post={post} user={user} reload={childReload}/>)}
      </>}
    </div>
  )
}

Posts.propTypes = {
  user: PropTypes.object
}