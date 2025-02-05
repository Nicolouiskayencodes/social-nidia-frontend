import { useEffect, useRef, useState } from "react"
import Post from "./post";
import PropTypes from "prop-types";
import styles from '../../styles/posts.module.css'
import { Link } from "react-router-dom";

export default function Posts({user}){
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(false)
  const [reload, setReload] = useState(false);
  const postContent = useRef(null)
  const photo = useRef(null);
  useEffect(()=>{
    setReload(false)
      fetch('https://social-nidia.onrender.com/post', {
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
  function createPost(event) {
    event.preventDefault()
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
    fetch('https://social-nidia.onrender.com/post', {
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
        setReload(true)
        }
      })
    }
  }
  }
    function childReload(){
      setReload(true)
    }
  return(
    <div className={styles.page}>
      <form className={styles.create}>
        <label htmlFor="post-content">What&apos;s on your mind?</label>
        <input type="file" ref={photo} name="picture" className={styles.inputs}></input>
        <input type="text" ref={postContent} id="post-content" className={styles.inputs}></input>
        {!loading && <button onClick={createPost} className={styles.inputs2}>Post</button>}
        {loading && <p>loading...</p>}
      </form>
      {posts && <>
        {posts.map(post => <Post key={post.id} post={post} user={user} reload={childReload}/>)}
        {(posts.length === 0) && <p>Nothing here? Add some <Link to={'/users'}>friends</Link> or join a <Link to={'/pages'}>group</Link>. Edit your <Link to={'/profile'}>profile</Link> here.</p>}
      </>}
    </div>
  )
}

Posts.propTypes = {
  user: PropTypes.object,
}