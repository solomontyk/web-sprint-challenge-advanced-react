import React, { useState } from 'react'
import axios from "axios"

// Suggested initial states
const initialMessage = ''

const initialEmail = ''

const initialSteps = 0

const initialIndex = 4 // the index the "B" is at

const initialX = 2

const initialY = 2

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  const [message, setMessage] = useState(initialMessage)
  const [email, setEmail] = useState(initialEmail)
  let [steps, setSteps] = useState(initialSteps)
  let [index, setIndex] = useState(initialIndex)
  let [x, setX] = useState(initialX)
  let [y, setY] = useState(initialY)

  function getXYMessage(direction) {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    setMessage(`You can't go ${direction}`)
  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setMessage(initialMessage)

    setEmail(initialEmail)
    
    setSteps(initialSteps)
    
    setIndex(initialIndex)
    
    setX(initialX)
    
    setY(initialY)
  }

  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    if (direction == "left"){
      if (x - 1 === 0){
        getXYMessage(direction)
        return x && y
      }
      setX(x - 1)
      setIndex(index - 1)
      setMessage(initialMessage)
    }
    
    if (direction == "right"){
      if (x + 1 === 4){
        getXYMessage(direction)
        return x && y
      }
      setX(x + 1)
      setIndex(index + 1)
      setMessage(initialMessage)
    }

    if (direction == "up"){
      if (y - 1 === 0){
        getXYMessage(direction)
        return x && y
      }
      setY(y - 1)
      setIndex(index - 3)
      setMessage(initialMessage)
    }
    if (direction == "down"){
      if (y + 1 === 4){
        getXYMessage(direction)
        return x && y
      }
      setY(y + 1)
      setIndex(index + 3)
      setMessage(initialMessage)
    }
    setSteps(steps + 1)
    }

  function move(evt) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    const direction = evt.target.value
    getNextIndex(direction) 
  }

  function onChange(evt) {
    // You will need this to update the value of the input.
    setEmail(evt.target.value)
    console.log(email)
  }

  function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
    evt.preventDefault()
    if (email == "") {
      setMessage("Ouch: email is required.")
    }else if (email == "foo@bar.baz"){
      setMessage("foo@bar.baz failure #71")
    }else if (((email.length - 1) + (email.length - 2) + (email.length - 3)) !== "com"){
      setMessage("Ouch: email must be a valid email")
    }
      let result = {
      "x": x,
      "y": y,
      "steps": steps,
      "email": email,
    }

    axios.post('http://localhost:9000/api/result', result)
      .then((res) => {
        setMessage(res.data.message)
      })
      .finally(setEmail(initialEmail))
      .catch(function (error) {
        console.log(error);
      });
    //reset()
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{`Coordinates (${x}, ${y})`}</h3>
        <h3 id="steps">{`You moved ${steps} ${steps === 1 ? 'time' : 'times'}`}</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" value={"left"} onClick={evt => move(evt)}>LEFT</button>
        <button id="up" value={"up"} onClick={evt => move(evt)}>UP</button>
        <button id="right" value={"right"} onClick={evt => move(evt)}>RIGHT</button>
        <button id="down" value={"down"} onClick={evt => move(evt)}>DOWN</button>
        <button id="reset" data-testid="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={evt => onSubmit(evt)}>
        <input onChange={evt => onChange(evt)} value={email} id="email" type="email" placeholder="type email"></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}