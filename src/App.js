import React from "react";
import Die from "./Die.js";
import "./style.css"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App(){

  const [dice,setDice] = React.useState(allNewDice())
  const [tenzies,setTenzies] = React.useState(false)

  const [rolls,setRolls] = React.useState(0)
  const [best,setBest] = React.useState(parseInt(localStorage.getItem("best")) || 0)

  React.useEffect(()=> {
    localStorage.setItem("best",best.toString());
  }, [best])

  React.useEffect(() => {
    const allHeld = dice.every(die => die.isHeld);
    const firstValue = dice[0].value;
    const sameValue = dice.every(die => die.value === firstValue);
    if (allHeld && sameValue) {
      setTenzies (true)
    }
  }, [dice])

  function generateNewDie(){
    return {
      value:Math.ceil(Math.random()*6), 
      isHeld:false,
      id: nanoid()
    }
  }

  function allNewDice(){
    const newDice=[]; 
    for (let i=0; i<10 ; i++)
    {newDice.push(generateNewDie())
    }
    return newDice
  }

  function rollDice(){
    if (tenzies){
      setTenzies(false)

      if (!best || rolls<best){
        setBest(rolls)
      }

      setDice(allNewDice())
      setRolls(0)
    } else {
    setDice(oldDice => oldDice.map(die=>{
      return die.isHeld ? 
        die : 
        generateNewDie()
    }))
    setRolls(prevRoll => prevRoll +1)
  }
  }

  function holdDice(id){
    setDice(oldDice=>oldDice.map(die=>{
      return die.id === id ? 
        {...die,isHeld:!die.isHeld} : die}))
  }

  const diceElements = dice.map(die=> (
    <Die 
      key={die.id} 
      value={die.value} 
      isHeld={die.isHeld} 
      holdDice={()=>holdDice(die.id)}/>
  )) 
  
  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">Roll until all dice are the same. 
        Click each die to freeze it at its current value between rolls.</p>
      <div className="dice-container">
          {diceElements}
      </div>
      <button onClick={rollDice} className="roll-dice">{tenzies ? "New Game" : "Roll"}</button>
      <div className="dice-stats">
        <div className="rolls">
          <p className="rolls-text">Rolls:</p>
          <p className="rolls-text">{rolls}</p>
        </div>
        <div className="rolls">
          <p className="rolls-text">Best:</p>
          <p className="rolls-text">{best}</p>
        </div>
      </div>
    </main>
  )
}