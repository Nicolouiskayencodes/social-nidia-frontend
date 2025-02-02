import PropTypes from "prop-types"
import { useRef, useState } from "react"
import { Link } from "react-router-dom";
import styles from "../../styles/comment.module.css"

export default function Comment({comment, user, reload}) {
  const [likes, setLikes] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const updateContent = useRef(null)
  function like() {
    setLoading(true)
    fetch(`https://social-nidia.onrender.com/likecomment/${comment.id}`,
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
      comment.likes.push({id:user.id, firstName: user.firstName, lastName: user.lastName})
      setLoading(false)
    })
  }
  function unlike() {
    setLoading(true)
    fetch(`https://social-nidia.onrender.com/unlikecomment/${comment.id}`,
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
    comment.likes.forEach(like => {
      if(like.id === user.id){
        comment.likes.splice(comment.likes.indexOf(like), 1)
      }
    })
    setLoading(false)
  })
  }
  function deletePost(event){
    event.preventDefault()
    if (!loading) {
      setLoading(true)
      fetch(`https://social-nidia.onrender.com/comment/${comment.id}`,
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
  function updateComment(event){
    event.preventDefault()
    if (!loading && updateContent.current.value.trim() !== '') {
      setLoading(true)
      fetch(`https://social-nidia.onrender.com/comment/${comment.id}`,
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
          comment.content = updateContent.current.value
        updateContent.current.value = ''
        setUpdating(false)
        }
        setLoading(false)
      })
    }
  }
  return(
    <div className={styles.comment}>
      {!updating ? (<>
      <p>{comment.content}</p>
      <div className={styles.info}>
        <p>{new Date(comment.createdAt).toLocaleString()}</p>
        <Link to={`/user/${comment.author.id}`} className={styles.user}><img src={comment.author.avatar} className={styles.avatar}/> {comment.author.firstName} {comment.author.lastName} <em>{comment.author.username}</em></Link>
      </div>
      {comment.author.id === user.id && <div className={styles.edit}>
          {(!deleting) ? (<><button onClick={()=>setUpdating(true)}>Update comment</button><button onClick={()=>setDeleting(true)}>Delete comment</button></>) :
          (<><label>Are you sure you want to delete your comment?</label>
            <button onClick={()=>setDeleting(false)}>Cancel</button>
            <button onClick={deletePost}>Yes, delete comment</button>
          </>)}
        </div >}
      <div className={styles.likes}>
        {comment.likes.some(like => (like.id === user.id)) ? (<button onClick={unlike}>Unlike</button>) : (<button onClick={like}>Like</button>)}
          {likes ? (<><button onClick={()=>setLikes(false)}>Hide Likes</button><div className={styles.likenames}>{comment.likes.map(like => <Link to={`/user/${like.id}`} key={comment.likes.indexOf(like)}>{like.firstName} {like.lastName} <em>{like.username}</em></Link>)}</div></>) : (<button onClick={()=>setLikes(true)}>{comment.likes.length} likes</button>)}
      </div>
        </>):(<div className={styles.update}>
        <input type="text" ref={updateContent} defaultValue={comment.content}></input>
        <button onClick={()=>setUpdating(false)}>Cancel</button>
        <button onClick={updateComment}>Update comment</button>
        </div>)}
    </div>
  )
}

Comment.propTypes = {
  comment: PropTypes.object,
  user: PropTypes.object,
  reload: PropTypes.func
}