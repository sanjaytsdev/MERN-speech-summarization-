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
  const [savedNotes, setSavedNotes] = useState(['Bandung, West Java. The Corruption Eradication Commission, better known as KPK, on Thursday launched the 2015 Anti-Corruption Festival, or Festa, in conjunction with the Bandung city government, to celebrate International Anti-Corruption Day. The festival will run until Friday. KPK acting chief Taufiqqurahman Ruki, National Police Chief Gen. Badrodin Haiti, House of Regional Representatives (DPD) Speaker Irman Gusman and Attorney General H.M. Prasetyo were to be joined by Political, Legal and Security Affairs Minister Luhut Panjaitan, Justice and Human Rights Minister Yasonna Laoly, Health Minister Nina Moeloek and Industry Minister Saleh Husin at the event. The KPK\'s Ruki opened the event on Thursday with a speech calling on the House to reconsider intentions to revise the KPK law, or "face the anti-corruption community." He pointed to three key aspects to the fight against corruption — human, cultural and systematic — and said that systematic aspect were the most important, as they reflects policies and laws. “We do not name someone as a suspect because we hold a grudge against that particular person or because we are driven by political motives," he said. "We do so in the name of the law." “Graft is a crime against humanity as it is proven to bring injustice and poverty and we have to eradicate it," Luhut said. "The country\'s leaders, whether at the central or regional government level, have to be good role models in fighting graft. I would like everyone to work together for a graft-free Indonesia." Bandung was selected to host the event as the city has the highest level of public engagement, infrastructure capability and corruption prevention, compared to other cities, KPK deputy chief Adnan Pandu Praja said. The KPK hopes Festa will encourage more Indonesians to join the fight against corruption by beginning in their own neighborhood. The festival will feature theater performances, live music and other events.'])
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
    const summary =response.data.summary;
    setSummarize([summary])

  }
  console.log(summarize)

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
