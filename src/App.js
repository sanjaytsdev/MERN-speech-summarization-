import React, { useState, useEffect } from 'react'
import { saveAs } from 'file-saver'
import axios from 'axios'

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
  // After clicking save text button in 1st box the text is stored in savedNotes and displayed in 2nd box.
  //Variable to be passes to summarize : savedNotes
  const [savedNotes, setSavedNotes] = useState(['India is a country where cricket is watched by many people. The 1983 Cricket world cup changed the perspective of many people in India. For others, cricket might just be a sport in which one team loses and the other wins but for us Indians cricket is everything and it has been followed by some crazy fans as a religion. We often hear the term ‘Cricket is a religion in India and Sachin is God’. '])
  // To toogle the state of start or stop button 
  const [state, setState] = useState(false)
  //For saving as .txt
  const textToSave = savedNotes


   // To set summarize
   const [summarize,setSummarize]= useState(null)

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

    handleListen()
  }, [isListening])

  function saveToFile(text) {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    saveAs(blob, 'file.txt')
  }



  const handleSaveNote = () => {
    setSavedNotes([...savedNotes, note])

    
    setNote('')
  }

  //To summarize the given text 
  const summarizeText = async() => {
    const textToSummarize = savedNotes[0];
    const response = await axios.post('http://localhost:5000/summarize', {
      Text: textToSummarize,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Handle the response, e.g., log the summarized text
    const data =response.data.summary
    let concatenatedText = ''
    data.forEach((item) => {
      if (item.text) {
        concatenatedText += item.text + ' '; // Add a space between text from different objects
      }
    });
  
    
    
   setSummarize(concatenatedText)

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
          <button onClick={() => { setIsListening(prevState => !prevState); Toggle() }}>
            {state ? "Stop " : "Start"}
          </button>
          <button onClick={clear} disabled={!note}>
            Clear
          </button>
          <p>{note}</p>
        </div>
        <div className="box">
          <h2>Saved Text</h2>
          <button onClick={() => { summarizeText() }}>
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
          <h2>Summarize</h2>
          <button>
            Translate
          </button>
          <button onClick={() => saveToFile(textToSave)} disabled={!savedNotes}>
            Save
          </button>
          <p>{summarize}</p>
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
