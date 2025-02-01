import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/groups.module.css"

export default function Pages() {
  const [groups, setGroups] = useState(null)
  useEffect(()=> {
    fetch('http://localhost:3000/group', {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("Authorization"),
      },
    }
    )
    .then(response => {return response.json()})
    .then(response => {
      setGroups(response)
    })
  })
  return(<div className={styles.groups}>
    <Link to={'/newgroup'} className={styles.allgroups}>Create new group</Link>
    {groups && groups.map(group => <Link to={`/page/${group.id}`} key={group.id}>{group.name}</Link>)}
  </div>)
}