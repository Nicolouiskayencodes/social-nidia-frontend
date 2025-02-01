import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import Post from "./post";
import { Link } from "react-router-dom";
import styles from "../../styles/page.module.css"

export default function Page({id, user}) {
  const [page, setPage] = useState(null)
  const [reload, setReload] = useState(false);
  const [admin, setAdmin] = useState(false)
  const [edit, setEdit] = useState(false)
  const [loading, setLoading] = useState(false)
  const bio = useRef(null);
  const banner = useRef(null);
  const sidebar = useRef(null);
  const photo = useRef(null)
  const postContent = useRef(null)
  useEffect(()=> {
    setReload(false)
    if (user){
    fetch(`http://localhost:3000/group/${id}`, {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("Authorization"),
      },
    }
    )
    .then(response => {return response.json()})
    .then(response => {
      console.log(response)
      setPage(response)
      if (response.admins.some(person=> person.id === user.id)){
        setAdmin(true)
      } else {
        setAdmin(false)
      }
    }
    )}
  }, [id, user, reload])
  function cancel(event) {
    event.preventDefault();
    bio.current.value = ''
    sidebar.current.value = ''
    banner.current.value = ''
    setEdit(false)
  }
  function editGroup(event) {
    event.preventDefault()
    {
      if (!loading){
      setLoading(true)
      const formData = new FormData()
      if (banner.current.files[0]){ 
        formData.append('file', banner.current.files[0])
      } else if (page.banner) {
        formData.append('banner', page.banner)
      }
      if (bio.current.value) { 
        formData.append('bio', bio.current.value)
      }
      if (sidebar.current.value) {
        formData.append('sidebar', sidebar.current.value)
      }
      if (banner.current.files[0] ||bio.current.value || sidebar.current.value){
      fetch(`http://localhost:3000/group/${id}`, {
        mode: "cors",
        method: "PUT",
        headers: {
        "Authorization": localStorage.getItem("Authorization")},
        body: formData
        })
        .then(response => {
          setLoading(false)
          setReload(true)
          setEdit(false)
          if (response.status === 200) {
          bio.current.value = null;
          banner.current.value = null;
          sidebar.current.value = null;
          }
        })
      }
    }
    }
  }

  function post(event) {
    event.preventDefault()
    {
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
      fetch(`http://localhost:3000/group/post/${id}`, {
        mode: "cors",
        method: "POST",
        headers: {
        "Authorization": localStorage.getItem("Authorization")},
        body: formData
        })
        .then(response => {
          setLoading(false)
          setReload(true)
          if (response.status === 200) {
          postContent.current.value = null;
          photo.current.value = null;
          }
        })
      }
    }
    }
  }
  function leave() {
    fetch(`http://localhost:3000/leave/${id}`, {
      method: "PUT",
      headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("Authorization"),
      },
    }
    )
    .then(response => {return response.json()})
    .then(response => {
      console.log(response)
      setReload(true)
    })
  }
  function join() {
    fetch(`http://localhost:3000/join/${id}`, {
      method: "PUT",
      headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("Authorization"),
      },
    }
    )
    .then(response => {return response.json()})
    .then(response => {
      console.log(response)
      setReload(true)
    })
  }
  function makeAdmin(userid) {
    fetch(`http://localhost:3000/admin/${id}/${userid}`, {
      method: "PUT",
      headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("Authorization"),
      },
    }
    )
    .then(response => {return response.json()})
    .then(response => {
      console.log(response)
      setReload(true)
    })
  }
  function adminDelete(postid){
    fetch(`http://localhost:3000/group/${page.id}/${postid}`, {
      method: "DELETE",
      headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("Authorization"),
      },
    }
    )
    .then(response => {return response.json()})
    .then(response => {
      console.log(response)
      setReload(true)
    })
  }
  function childReload(){
    setReload(true)
  }

  return(<div className={styles.page}>
    {page && <>
    {page.banner && <img src={page.banner} className={styles.banner}></img>}
    <h1>{page.name}</h1>
    <p>{page.bio}</p>
    {(page.members.some(member => member.id === user.id)) ? (
      <button onClick={leave}>Leave group</button>
    ) : (
      <button onClick={join}>Join group</button>
    )}
    {admin && <>
      {edit ? (<form>
        <label htmlFor="bio">Bio: </label>
        <textarea id="bio" ref={bio}>{page.bio}</textarea>
        <label htmlFor="sidebar">Sidebar: </label>
        <textarea id="sidebar" ref={sidebar}>{page.sidebar}</textarea>
        <label htmlFor="banner">Banner image: </label>
        <input type="file" ref={banner} id="banner" ></input>
        <button onClick={cancel}>Cancel edit</button>
        <button onClick={editGroup}>Edit group</button>
      </form>) 
      : (<button onClick={()=>setEdit(true)}>Edit group</button>)}
    </>}
    <form>
        <label htmlFor="post-content">What&apos;s on your mind?</label>
        <input type="file" ref={photo} name="picture"></input>
        <input type="text" ref={postContent} id="post-content"></input>
        <button onClick={post}>Post</button>
      </form>
      {page.posts.map(post => <div key={post.id}><Post key={post.id} post={post} user={user} reload={childReload}/>
      {admin && <button onClick={()=>adminDelete(post.id)}>Delete Post</button>}</div>)}
    <div>
      <div>{page.sidebar}</div>
      {page.members.map(member => <div key={member.id}> {member.id !== user.id && <>
      <span>{(member.firstName || member.lastName) ? (<>{member.firstName} {member.lastName}</>):(<>{member.username}</>)}</span>
      {(admin && !(page.admins.some(person => person.id === member.id))) && <button onClick={()=>makeAdmin(member.id)}>Promote to admin</button>}
      <Link to={`/user/${user.id}`}>Profile</Link>
      </>}</div>)}
    </div>
    </>}
  </div>)
}

Page.propTypes = {
  id: PropTypes.string,
  user: PropTypes.object
}