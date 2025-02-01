import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import styles from "../../styles/mypages.module.css"

export default function MyPages({pages}) {

  return(<div className={styles.mypages}>
    <Link to={'/pages'} className={styles.allpages}>See all groups</Link>
    <h2>Groups</h2>
    {pages.map(page => <div key={page.id}>
      <Link to={`/page/${page.id}`}>{page.name}</Link>
      </div>)}
    </div>)
}

MyPages.propTypes = {
  pages: PropTypes.array
}