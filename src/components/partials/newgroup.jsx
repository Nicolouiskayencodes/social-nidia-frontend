import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/newgroup.module.css"

export default function NewGroup () {
  const groupName = useRef(null);
  const [loading, setLoading] = useState(false)
  const [taken, setTaken] = useState(false)
  const navigate = useNavigate()
  const createGroup = (event) => {
    event.preventDefault();
    setLoading(true)
    if (!loading) {
    fetch('https://social-nidia.onrender.com/group', {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("Authorization"),
      },
      body: JSON.stringify({
        groupName: groupName.current.value
      })
    }
    )
    .then(response => {
      if (response.status === 200){
      return response.json()}
      if (response.status === 500){
        setTaken(true)
        groupName.current.value = ''
      }
    }
    )
    .then(response => {
      console.log(response)
      navigate(`/page/${response.id}`)
    })
  }
    setLoading(false)
  }
  return(
    <form className={styles.form}>
      {taken && <p>That name is already taken</p>}
      <label htmlFor="grpname">Group Name:</label>
      <input id="grpname" type="text" ref={groupName}></input>
      <button onClick={createGroup}>Create Group</button>
    </form>
  )
}