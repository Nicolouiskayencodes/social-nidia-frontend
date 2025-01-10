import PropTypes from "prop-types"
import Comment from "./comment"

export default function Post({post}) {
  return(
    <div>
        <img src={post.image}></img>
        <p>{post.content}</p>
        <p>{Date(post.createdAt)}</p>
        <p>{post.author.firstName} {post.author.lastName}</p>
        <p>{post.likes.length} likes</p>
        <div>
          <h3>Comments</h3>
          {post.comments.map(comment => <Comment key={comment.id} comment={comment}/>)}
        </div>
    </div>
  )
}

Post.propTypes = {
  post: PropTypes.object
}