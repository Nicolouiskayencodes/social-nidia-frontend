import { useEffect, useRef, useState } from "react";
import Post from "./post";
import styles from "../../styles/profile.module.css"

export default function Profile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [reload, setReload] = useState(false);
  const [edit, setEdit] = useState(false);
  const postContent = useRef(null)
  const photo = useRef(null);
  const avatar = useRef(null);
  const firstName = useRef(null);
  const lastName = useRef(null);
  const bio = useRef(null);
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
  function changeAvatar(event){
    event.preventDefault()
    if (!loading){
      setLoading(true)
      const formData = new FormData()
      if (photo.current.files[0]){ 
        formData.append('file', avatar.current.files[0])
      }
      fetch('https://social-nidia.onrender.com/avatar', {
        mode: "cors",
        method: "PUT",
        headers: {
        "Authorization": localStorage.getItem("Authorization")},
        body: formData
        })
        .then(response => {
          setLoading(false)
          if (response.status === 200) {
          avatar.current.value = null;
          setReload(true)
          }
        })
      }
  }
  function changeName(event){
    event.preventDefault();
    fetch('https://social-nidia.onrender.com/username', {
      method: "PUT",
      headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("Authorization"),
      },
      body: JSON.stringify({
        firstName: firstName.current.value,
        lastName: lastName.current.value,
      })
    }
    )
    .then(response => {
      setLoading(false)
      if (response.status === 200) {
        console.log('success')
        setReload(true)
      }
    })
  }
  function changeBio(event){
    event.preventDefault();
    fetch('https://social-nidia.onrender.com/bio', {
      method: "PUT",
      headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("Authorization"),
      },
      body: JSON.stringify({
        bio: bio.current.value,
      })
    }
    )
    .then(response => {
      setLoading(false)
      if (response.status === 200) {
        console.log('success')
        setReload(true)
      }
    })
  }
  return(
    <div className={styles.profile}>{user && <>
      <div className={styles.info}>
        <img src={user.avatar} className={styles.avatar}></img>
        <div className={styles.bio}>
          <h1>{user.firstName} {user.lastName}</h1>
          <h2>{user.username}</h2>
          <p>{user.bio}</p>
          <button onClick={()=>setEdit(true)}>Edit Profile</button>
        </div>
      </div>
      {edit && <div className={styles.edit}>
        <div className={styles.field}>
          <label htmlFor="#avatar">Profile Photo:</label>
          <input type="file" id="avatar" ref={avatar}></input>
          {!loading && <button onClick={changeAvatar}>Change profile picture</button>}
        </div>
        <div className={styles.field}>
          <label htmlFor="#firstname">First Name:</label>
          <input type="text" id="firstname" ref={firstName} defaultValue={user.firstName}></input>
          <label htmlFor="#lastname">Last Name:</label>
          <input type="text" id="lastname" ref={lastName} defaultValue={user.lastName}></input>
          {!loading && <button onClick={changeName}>Change display name</button>}
        </div>
        <div className={styles.field}>
          <label htmlFor="#bio">Bio</label>
          <input type="text" id="bio" ref={bio} defaultValue={user.bio}></input>
          {!loading && <button onClick={changeBio}>Change Bio</button>}
        </div>
        {loading && <p>loading...</p>}
        <button onClick={()=>setEdit(false)}>Close edit</button>
        </div>}
      <form className={styles.create}>
        <label htmlFor="post-content">What&apos;s on your mind?</label>
        <input type="file" ref={photo} name="picture"></input>
        <input type="text" ref={postContent} id="post-content" className={styles.inputs}></input>
        {!loading && <button onClick={createPost} className={styles.inputs2}>Post</button>}
        {loading && <p>loading...</p>}
      </form>
      {user.posts.map(post => <div key={post.id}>{!post.groupId && <Post post={post} user={user} reload={childReload}/>}
        </div>)}
    </>}
    </div>
  )
}