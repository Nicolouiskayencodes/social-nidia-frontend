import PropTypes from "prop-types"

export default function Comment({comment}) {

  return(
    <div>
      <p>{comment.content}</p>
      <p>{Date(comment.createdAt)}</p>
      <p>{comment.author.firstName} {comment.author.lastName}</p>
    </div>
  )
}

Comment.propTypes = {
  comment: PropTypes.object
}