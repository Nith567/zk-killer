'use client'
import React, { useRef, useEffect } from 'react';
import ReactDice, { ReactDiceRef,useState } from 'react-dice-complete';

const RollingDice = ({ initialDiceValues }) => {
  const reactDice = useRef(null);
  const [selectedDice, setSelectedDice] = useState(Array(5).fill(0)); 

  const rollDone = (totalValue, values) => {
    console.log('individual die values array:', values);
    console.log('total dice value:', totalValue);
  };

  const rollAll = (diceValues) => {
    reactDice.current?.rollAll(diceValues);
  };
  const toggleDice = (index) => {
    const newSelectedDice = [...selectedDice];
    newSelectedDice[index] = newSelectedDice[index] === 0 ? 1 : 0;
    setSelectedDice(newSelectedDice);
  };

  useEffect(() => {
    rollAll(initialDiceValues);
  }, [initialDiceValues]);

  return (
    <div>
    <ReactDice
      numDice={5}
      ref={reactDice}
      rollDone={rollDone}
      disableIndividual={true}
      outlineColor={'#B59053'}
      onClick={(event) => {
        const dieIndex = event.target.dataset['dieindex'];
        toggleDice(dieIndex);
      }}
    />
    <div>
      Selected Dice: {selectedDice.map((value, index) => (
        <span key={index}>{value} </span>
      ))}
          </div>
    </div>
  );
};

export default RollingDice;

