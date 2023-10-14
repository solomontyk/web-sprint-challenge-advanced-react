import React from 'react'
import axios from 'axios'

// Suggested initial states
let initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at
const initialX = 2
const initialY = 2
/*const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
}
*/
export default class AppClass extends React.Component {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  constructor() {
    super()
    this.state = {
      message: initialMessage,
      email: initialEmail,
      steps: initialSteps,
      index: initialIndex,
      x: initialX,
      y: initialY
    }
  }

  getXYMessage = (direction) => {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    this.setState({message: `You can't go ${direction}`})
  }

  reset = () => {
    // Use this helper to reset all states to their initial values.
    this.setState({
      message: initialMessage,
      email: initialEmail,
      steps: initialSteps,
      index: initialIndex,
      x: initialX,
      y: initialY
    })
  }

  getNextIndex = (direction) => {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    if (direction == "left"){
      if (this.state.x - 1 === 0){
        this.getXYMessage(direction)
        return this.state.x && this.state.y
      }
      this.setState({
        x: this.state.x - 1,
        index: this.state.index - 1,
        message: initialMessage
      })
    }
    
    if (direction == "right"){
      if (this.state.x + 1 === 4){
        this.getXYMessage(direction)
        return this.state.x && this.state.y
      }
      this.setState({
        x: this.state.x + 1,
        index: this.state.index + 1,
        message: initialMessage
      })
    }
    
    if (direction == "up"){
      if (this.state.y - 1 === 0){
        this.getXYMessage(direction)
        return this.state.x && this.state.y
      }
      this.setState({
        y: this.state.y - 1,
        index: this.state.index - 3,
        message: initialMessage
      })
    }
    
    if (direction == "down"){
      if (this.state.y + 1 === 4){
        this.getXYMessage(direction)
        return this.state.x && this.state.y
      }
      this.setState({
        y: this.state.y + 1,
        index: this.state.index + 3,
        message: initialMessage
      })
    }

    this.setState({steps: this.state.steps + 1 })
  }

  move = (evt) => {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    const direction = evt.target.value
    this.getNextIndex(direction)
  }

  onChange = (evt) => {
    // You will need this to update the value of the input.
    this.setState({email: evt.target.value})
  }

  onSubmit = (evt) => {
    // Use a POST request to send a payload to the server.
    evt.preventDefault()
    if (this.state.email == "") {
      this.setState({message: "Try again: email is required."})
    }else if (this.state.email == "foo@bar.baz"){
      this.setState({message: "foo@bar.baz failure #71"})
    }else if (((this.state.email.length - 1) + (this.state.email.length - 2) + (this.state.email.length - 3)) !== "com"){
      this.setState({message: "Ouch: email must be a valid email"})
    }
    let result = {
      "x": this.state.x,
      "y": this.state.y,
      "steps": this.state.steps,
      "email": this.state.email,
    }
    
    axios.post('http://localhost:9000/api/result', result)
      .then((res) => {
        this.setState({message: res.data.message})
      })
      .finally(this.setState({email: initialEmail}))
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    const { className } = this.props
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{`Coordinates (${this.state.x}, ${this.state.y})`}</h3>
          <h3 id="steps">{`You moved ${this.state.steps} ${this.state.steps === 1 ? 'time' : 'times'}`}</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === this.state.index ? ' active' : ''}`}>
                {idx === this.state.index ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
        <button id="left" value={"left"} onClick={evt => this.move(evt)}>LEFT</button>

        <button id="up" value={"up"} onClick={evt => this.move(evt)}>UP</button>

        <button id="right" value={"right"} onClick={evt => this.move(evt)}>RIGHT</button>

        <button id="down" value={"down"} onClick={evt => this.move(evt)}>DOWN</button>
        
        <button id="reset" data-testid="reset" onClick={this.reset}>reset</button>
        </div>
        <form onSubmit={evt => this.onSubmit(evt)}>
          <input onChange={evt => this.onChange(evt)} value={this.state.email} id="email" type="email" placeholder="type email"></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    )
  }
}