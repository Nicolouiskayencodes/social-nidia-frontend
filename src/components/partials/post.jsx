import PropTypes from "prop-types"
import Comment from "./comment"
import { useRef, useState } from "react"
import { Link } from "react-router-dom"

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
      fetch(`http://localhost:3000/comment/${post.id}`,
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
    fetch(`http://localhost:3000/likepost/${post.id}`,
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
    fetch(`http://localhost:3000/unlikepost/${post.id}`,
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
      fetch(`http://localhost:3000/post/${post.id}`,
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
      fetch(`http://localhost:3000/post/${post.id}`,
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
    <div>
      {(user && post) && <>
      {!updating ? (<>
        <img src={post.image}></img>
        <p>{post.content}</p>
        <p>{new Date(post.createdAt).toLocaleString()}</p>
        <Link to={`/user/${post.author.id}`}>{post.author.firstName} {post.author.lastName} <em>{post.author.username}</em></Link>
        {post.author.id === user.id && <>
          {(!deleting) ? (<><button onClick={()=>setUpdating(true)}>Update post</button><button onClick={()=>setDeleting(true)}>Delete post</button></>) :
          (<><label>Are you sure you want to delete your post?</label>
            <button onClick={()=>setDeleting(false)}>Cancel</button>
            <button onClick={deletePost}>Yes, delete post</button>
          </>)}
        </>}
        {post.likes.some(like => (like.id === user.id)) ? (<button onClick={unlike}>Unlike</button>) : (<button onClick={like}>Like</button>)}
        {likes ? (<><button onClick={()=>setLikes(false)}>Hide Likes</button>{post.likes.map(like => <Link to={`/user/${like.id}`} key={post.likes.indexOf(like)}>{like.firstName} {like.lastName} <em>{like.username}</em></Link>)}</>) : (<button onClick={()=>setLikes(true)}>{post.likes.length} likes</button>)}
        <div>
          {comments ? (<>
            <button onClick={()=>setComments(false)}>Hide comments</button>
            {post.comments.map(comment => <Comment key={comment.id} comment={comment} user={user} reload={reload}/>)}
            <form>
            <label htmlFor="comment">Leave a comment:</label>
            <input type="text" ref={newComment}></input>
            <button onClick={submitComment}>Post comment</button>
          </form>
          </>) : (
            <button onClick={()=>setComments(true)}>{post.comments.length} Comments</button>
          )}
        </div>
        </>):(<>
        <input type="text" ref={updateContent} defaultValue={post.content}></input>
        <button onClick={()=>setUpdating(false)}>Cancel</button>
        <button onClick={updatePost}>Update post</button>
        </>)}
        </>}
    </div>
  )
}

Post.propTypes = {
  post: PropTypes.object,
  user: PropTypes.object,
  reload: PropTypes.func,
}