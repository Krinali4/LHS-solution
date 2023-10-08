import React from 'react'
import "./dashboard.css"

const DateHeader = () => {

    let newDate = new Date()
  let options = { 
    day : "numeric",
    month : "long",
  year : "numeric" }
    return (
        <div>
           {Intl.DateTimeFormat("en-US", options).format(newDate)}  
        </div> 
    )
}

export default DateHeader
