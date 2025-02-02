import { useEffect, useRef, useState } from "react";
import Post from "./post";
import styles from "../../styles/profile.module.css"

export default function Profile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [reload, setReload] = useState(false);
  const postContent = useRef(null)
  const photo = useRef(null);
  useEffect(()=>{
    setReload(false)
    fetch('https://social-nidia.onrender.com/user', {
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
  }, [setUser, reload])
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
        }
      })
    }
  }
  }
  function childReload(){
    setReload(true)
  }
  return(
    <div className={styles.profile}>{user && <>
    
      <div className={styles.info}>
        <img src={user.avatar} className={styles.avatar}></img>
        <div className={styles.bio}>
          <h1>{user.firstName} {user.lastName}</h1>
          <h2>{user.username}</h2>
          <p>{user.bio}</p>
        </div>
      </div>
      <form className={styles.create}>
        <label htmlFor="post-content">What&apos;s on your mind?</label>
        <input type="file" ref={photo} name="picture"></input>
        <input type="text" ref={postContent} id="post-content" className={styles.inputs}></input>
        <button onClick={createPost} className={styles.inputs2}>Post</button>
      </form>
      {user.posts.map(post => <div key={post.id}>{!post.groupId && <Post post={post} user={user} reload={childReload}/>}
        </div>)}
    </>}
    </div>
  )
}