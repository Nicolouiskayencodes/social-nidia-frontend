import PropTypes from "prop-types"
import Comment from "./comment"
import { useRef, useState } from "react"
import { Link } from "react-router-dom"
import styles from "../../styles/post.module.css"

export default function Post({post, user, reload}) {
  const [comments, setComments] = useState(false)
  const [likes, setLikes] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const newComment = useRef(null)
  const updateContent = useRef(null)

  function submitComment(event) {
    event.preventDefault()
    if(!loading && newComment.current.value.trim() !== ''){
      setLoading(true)
      fetch(`https://social-nidia.onrender.com/comment/${post.id}`,
        {
          mode: "cors",
          method: "POST",
          headers: { "Content-Type": "application/json",
          "Authorization": localStorage.getItem("Authorization")},
          body: JSON.stringify({
            content: newComment.current.value
          })
          }
      )
      .then(response => {
        setLoading(false)
        if (response.status === 200) {
          newComment.current.value = ''
        }
      })
    }
    reload()
  }
  function like() {
    setLoading(true)
    fetch(`https://social-nidia.onrender.com/likepost/${post.id}`,
        {
          mode: "cors",
          method: "PUT",
          headers: { "Content-Type": "application/json",
          "Authorization": localStorage.getItem("Authorization")},
          }
      )
    .then(response => {
      if (response.status=== 200) {
        return response.json()
      }} )
    .then(response => {
      console.log(response)
      post.likes.push({id:user.id, firstName: user.firstName, lastName: user.lastName})
      setLoading(false)
    })
  }
  function unlike() {
    setLoading(true)
    fetch(`https://social-nidia.onrender.com/unlikepost/${post.id}`,
      {
        mode: "cors",
        method: "PUT",
        headers: { "Content-Type": "application/json",
        "Authorization": localStorage.getItem("Authorization")},
        }
    )
  .then(response => {
    if (response.status=== 200) {
      return response.json()
    }} )
  .then(response => {
    console.log(response)
    post.likes.forEach(like => {
      if(like.id === user.id){
        post.likes.splice(post.likes.indexOf(like), 1)
      }
    })
    setLoading(false)
  })
  }
  function deletePost(event){
    event.preventDefault()
    if (!loading) {
      setLoading(true)
      fetch(`https://social-nidia.onrender.com/post/${post.id}`,
        {
          mode: "cors",
          method: "DELETE",
          headers: { "Content-Type": "application/json",
          "Authorization": localStorage.getItem("Authorization")},
          }
      )
      .then(response =>{
        console.log(response)
        setLoading(false)
        setDeleting(false)
        reload()
      })
    }
  }
  function updatePost(event){
    event.preventDefault()
    if (!loading && updateContent.current.value.trim() !== '') {
      setLoading(true)
      fetch(`https://social-nidia.onrender.com/post/${post.id}`,
        {
          mode: "cors",
          method: "PUT",
          headers: { "Content-Type": "application/json",
          "Authorization": localStorage.getItem("Authorization")},
          body: JSON.stringify({
            content: updateContent.current.value
          })
          }
      )
      .then(response =>{
        console.log(response)
        if (response.status === 200){
          post.content = updateContent.current.value
        updateContent.current.value = ''
        setUpdating(false)
        }
        setLoading(false)
      })
    }
  }

  return(
    <div className={styles.post}>
      {(user && post) && <>
      {!updating ? (<>
        <img src={post.image} className={styles.image}></img>
        <p>{post.content}</p>
        <div className={styles.info}>
          <p>{new Date(post.createdAt).toLocaleString()}</p>
          <Link to={`/user/${post.author.id}`} className={styles.user}><img src={post.author.avatar} className={styles.avatar}/> {post.author.firstName} {post.author.lastName} <em>{post.author.username}</em></Link>
        </div>
        {post.author.id === user.id && <div className={styles.edit}>
          {(!deleting) ? (<><button onClick={()=>setUpdating(true)}>Update post</button><button onClick={()=>setDeleting(true)}>Delete post</button></>) :
          (<><label>Are you sure you want to delete your post?</label>
            <button onClick={()=>setDeleting(false)}>Cancel</button>
            <button onClick={deletePost}>Yes, delete post</button>
          </>)}
        </div>}
        <div className={styles.likes}>
          {post.likes.some(like => (like.id === user.id)) ? (<button onClick={unlike}>Unlike</button>) : (<button onClick={like}>Like</button>)}
          {likes ? (<><button onClick={()=>setLikes(false)}>Hide Likes</button><div className={styles.likenames}>{post.likes.map(like => <Link to={`/user/${like.id}`} key={post.likes.indexOf(like)} className={styles.user}><img src={like.avatar} className={styles.avatar}/> {like.firstName} {like.lastName} <em>{like.username}</em></Link>)}</div></>) : (<button onClick={()=>setLikes(true)}>{post.likes.length} likes</button>)}
        </div>
        <div>
          {comments ? (<>
            <button onClick={()=>setComments(false)}>Hide comments</button>
            {post.comments.map(comment => <Comment key={comment.id} comment={comment} user={user} reload={reload}/>)}
            <form className={styles.comment}>
            <label htmlFor="comment">Leave a comment:</label>
            <input type="text" ref={newComment}></input>
            <button onClick={submitComment}>Post comment</button>
          </form>
          </>) : (
            <button onClick={()=>setComments(true)}>{post.comments.length} Comments</button>
          )}
        </div>
        </>):(<div className={styles.update}>
        <input type="text" ref={updateContent} defaultValue={post.content}></input>
        <button onClick={()=>setUpdating(false)}>Cancel</button>
        <button onClick={updatePost}>Update post</button>
        </div>)}
        </>}
    </div>
  )
}

Post.propTypes = {
  post: PropTypes.object,
  user: PropTypes.object,
  reload: PropTypes.func,
}