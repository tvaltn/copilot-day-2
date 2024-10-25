import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [history, setHistory] = useState([]);
  const inputRef = useRef(null);
  const historyRef = useRef(null);

  const handleClick = (value) => {
    if (['+', '-', '*', '/', '(', ')', '^'].includes(value)) {
      if (value === '(' || value === ')') {
        const openParentheses = (input.match(/\(/g) || []).length;
        const closeParentheses = (input.match(/\)/g) || []).length;
        if (openParentheses > closeParentheses && !['+', '-', '*', '/', '(', '^'].includes(input.slice(-1))) {
          setInput(input + ')');
        } else if (input === '' || ['+', '-', '*', '/', '(', '^'].includes(input.slice(-1))) {
          setInput(input + '(');
        }
      } else if (value === '^') {
        if (/\d/.test(input.slice(-1))) {
          setInput(input + value);
        }
      } else {
        if (!['+', '-', '*', '/', '(', '^'].includes(input.slice(-1))) {
          setInput(input + value);
        }
      }
    } else if (value === '.') {
      const lastNumber = input.split(/[\+\-\*\/\(\)\^]/).pop();
      if (lastNumber && !lastNumber.includes('.')) {
        setInput(input + value);
      }
    } else {
      setInput(input + value);
    }
  };

  const handleClear = () => {
    setInput('');
    setResult('');
  };

  const handleBackspace = () => {
    setInput(input.slice(0, -1));
  };

  const handleCalculate = () => {
    if (!input) {
      setResult(''); // Clear the result field if input is empty
      return;
    }
    try {
      // Replace ^ with ** for exponentiation
      const sanitizedInput = input.replace(/\^/g, '**');
      // Use Function constructor as a safer alternative to eval
      const result = new Function(`return ${sanitizedInput}`)();
      setResult(result);
      setInput(result.toString());
      setHistory([...history, `${input} = ${result}`]);
    } catch (error) {
      setResult('Error');
    }
  };

  const handleKeyPress = (event) => {
    const { key } = event;
    if (/\d/.test(key)) {
      handleClick(key);
    } else if (['+', '-', '*', '/', '(', ')', '^'].includes(key)) {
      handleClick(key);
    } else if (key === 'Dead') { // Handle dead key for ^ on some keyboards
      handleClick('^');
    } else if (key === '.') {
      handleClick(key);
    } else if (key === 'Enter') {
      event.preventDefault();
      handleCalculate();
    } else if (key === 'Backspace') {
      handleBackspace();
    } else if (key === 'Escape') {
      handleClear();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [input]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.scrollLeft = inputRef.current.scrollWidth;
    }
  }, [input]);

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Calculator by Copilot</h1>
      </header>
      <div className="content">
        <div className="calculator">
          <div className="display">
            <input type="text" value={input} readOnly ref={inputRef} />
            <div className="result">{result}</div>
          </div>
          <div className="buttons">
            <button className="operator" onClick={handleClear}>C</button>
            <button className="operator" onClick={() => handleClick('(')}>( )</button>
            <button className="operator" onClick={() => handleClick('^')}>^</button>
            <button className="operator" onClick={() => handleClick('/')}>/</button>
            <button onClick={() => handleClick('7')}>7</button>
            <button onClick={() => handleClick('8')}>8</button>
            <button onClick={() => handleClick('9')}>9</button>
            <button className="operator" onClick={() => handleClick('*')}>*</button>
            <button onClick={() => handleClick('4')}>4</button>
            <button onClick={() => handleClick('5')}>5</button>
            <button onClick={() => handleClick('6')}>6</button>
            <button className="operator" onClick={() => handleClick('-')}>-</button>
            <button onClick={() => handleClick('1')}>1</button>
            <button onClick={() => handleClick('2')}>2</button>
            <button onClick={() => handleClick('3')}>3</button>
            <button className="operator" onClick={() => handleClick('+')}>+</button>
            <button onClick={() => handleClick('0')}>0</button>
            <button onClick={() => handleClick('.')}>.</button>
            <button onClick={handleBackspace}>←</button>
            <button className="operator" onClick={handleCalculate}>=</button>
          </div>
        </div>
        <div className="history" ref={historyRef}>
          <h2>History</h2>
          <ul>
            {history.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="footer-padding"></div>
    </div>
  );
}

export default App;