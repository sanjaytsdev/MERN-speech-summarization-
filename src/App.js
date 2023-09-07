import React, { useState, useEffect } from 'react'
import './App.css'
import { saveAs } from 'file-saver'

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition
const mic = new SpeechRecognition()

mic.continuous = true
mic.interimResults = true
// language
mic.lang = 'en-IN' 

function App() {
  const [isListening, setIsListening] = useState(false)
  //Recorded Voice is Saved in Note (1st Box)
  const [note, setNote] = useState(null)
  // After clicking save text button in 1st box the text is stored in savedNotes and displayed in 2nd box
  const [savedNotes, setSavedNotes] = useState([])
  // To toogle the state of start or stop button 
  const [state, setState] = useState(false)
  //For saving as .txt
  const textToSave = savedNotes

  const Toggle = () => {
    setState(!state)
  }

  const Clear = () => {
    setSavedNotes([])
  }

  const clear = () => {
    setNote([])
  } 

  useEffect(() => {
    handleListen()
  },[isListening])

  function saveToFile(text){
    const blob = new Blob([text],{type:'text/plain;charset=utf-8'})
    saveAs(blob,'file.txt')
  }

  const handleListen = () => {
    if (isListening) {
      mic.start()
      mic.onend = () => {
        console.log('continue..')
        mic.start()
      }
    } else {
      mic.stop()
      mic.onend = () => {
        console.log('Stopped Mic on Click')
      }
    }
    mic.onstart = () => {
      console.log('Mics on')
    }

    mic.onresult = event => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('')
      console.log(transcript)
      setNote(transcript)
      mic.onerror = event => {
        console.log(event.error)
      }
    }
  }

  const handleSaveNote = () => {
    setSavedNotes([...savedNotes, note])
    setNote('')
  }

  return (
    <>
      <h1>Speech Recogonition</h1>
      <div className="container">
        <div className="box">
          <h2>Current speech text</h2>
          {isListening ? <span>🎙️Recording....</span> : <span>🛑🎙️</span>}
          <button onClick={handleSaveNote} disabled={!note}>
            Save text
          </button>
          <button onClick={() => {setIsListening(prevState => !prevState);Toggle()}}>
            {state ? "Stop " : "Start"}
          </button>
          <button onClick={clear} disabled={!note}>
            Clear
          </button>
          <p>{note}</p>
        </div>
        <div className="box">
          <h2>Saved Text</h2>
           <button>
                Summarize
          </button>
          <button onClick={Clear}>
            Clear
          </button>
          <button onClick={() => saveToFile(textToSave)} disabled={!savedNotes}>
            Save
          </button>
          {savedNotes.map(n => (
            <p key={n}>{n}</p>
          ))}
        </div>
        <div className="box">
          <h2>Summarized Text</h2>
             <button>
                    Translate
          </button>
          <button onClick={() => saveToFile(textToSave)} disabled={!savedNotes}>
            Save
          </button>
        </div>
        <div className="box">
          <h2>Translated Text</h2>
          <button onClick={() => saveToFile(textToSave)} disabled={!savedNotes}>
            Save
          </button>
        </div>
      </div>
    </>
  )
}

export default App
