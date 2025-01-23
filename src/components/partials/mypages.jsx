import PropTypes from "prop-types"
import { Link } from "react-router-dom"

export default function MyPages({pages}) {

  return(<div>
    <Link to={'/pages'}>See all groups</Link>
    {pages.map(page => <div key={page.id}>
      <Link to={`/page/${page.id}`}>{page.name}</Link>
      </div>)}
    </div>)
}

MyPages.propTypes = {
  pages: PropTypes.array
}