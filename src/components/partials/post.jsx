import PropTypes from "prop-types"
import Comment from "./comment"
import { useRef, useState } from "react"

export default function Post({post, user}) {
  const [comments, setComments] = useState(false)
  const [likes, setLikes] = useState(false)
  const [loading, setLoading] = useState(false)
  const newComment = useRef(null)

  function submitComment() {
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
        if (response.status === 200) {
          setLoading(false)
          newComment.current.value = ''
        }
      })
    }
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

  return(
    <div>
      {(user && post) && <>
        <img src={post.image}></img>
        <p>{post.content}</p>
        <p>{Date(post.createdAt)}</p>
        <p>{post.author.firstName} {post.author.lastName}</p>
        {post.likes.some(like => (like.id === user.id)) ? (<button onClick={unlike}>Unlike</button>) : (<button onClick={like}>Like</button>)}
        {likes ? (<><button onClick={()=>setLikes(false)}>Hide Likes</button>{post.likes.map(like => <div key={post.likes.indexOf(like)}>{like.firstName} {like.lastName}</div>)}</>) : (<button onClick={()=>setLikes(true)}>{post.likes.length} likes</button>)}
        <div>
          <h3>Comments</h3>
          {comments ? (<>
            <button onClick={()=>setComments(false)}>Hide comments</button>
            {post.comments.map(comment => <Comment key={comment.id} comment={comment} user={user}/>)}
          </>) : (
            <button onClick={()=>setComments(true)}>{post.comments.length} Comments</button>
          )}
          <form>
            <label htmlFor="comment">Leave a comment:</label>
            <input type="text" ref={newComment}></input>
            <button onClick={submitComment}>Post comment</button>
          </form>
        </div>
        </>}
    </div>
  )
}

Post.propTypes = {
  post: PropTypes.object,
  user: PropTypes.object
}