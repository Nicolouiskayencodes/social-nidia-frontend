import PropTypes from "prop-types"
import { useState } from "react"

export default function Comment({comment, user}) {
  const [likes, setLikes] = useState(false)
  function like() {
    fetch(`http://localhost:3000/likecomment/${comment.id}`,
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
    })
  }
  function unlike() {
    fetch(`http://localhost:3000/unlikecomment/${comment.id}`,
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
  })
  }
  return(
    <div>
      <p>{comment.content}</p>
      <p>{Date(comment.createdAt)}</p>
      <p>{comment.author.firstName} {comment.author.lastName}</p>
      {comment.likes.some(like => (like.id === user.id)) ? (<button onClick={unlike}>Unlike</button>) : (<button onClick={like}>Like</button>)}
        {likes ? (<><button onClick={()=>setLikes(false)}>Hide Likes</button>{comment.likes.map(like => <div key={comment.likes.indexOf(like)}>{like.firstName} {like.lastName}</div>)}</>) : (<button onClick={()=>setLikes(true)}>{comment.likes.length} likes</button>)}
    </div>
  )
}

Comment.propTypes = {
  comment: PropTypes.object,
  user: PropTypes.object
}