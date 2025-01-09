import { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState(null)
    useEffect(()=>{
      fetch('http://localhost:3000/user', {
        mode: "cors",
      method: "GET",
      headers: { "Content-Type": "application/json",
      "Authorization": localStorage.getItem("Authorization")},
      })
      .then(response => {
        if (response.status === 200) {
        return response.json();
        }
      })
      .then(response => {
        console.log(response)
        setUser(response)
      })
    }, [setUser])
  return(
    <div>Profile</div>
  )
}