import React, { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import axios from "axios";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();

mic.continuous = true;
mic.interimResults = true;
// language
mic.lang = "en-IN";

function App() {
  const [isListening, setIsListening] = useState(false);
  //Recorded Voice is Saved in Note (1st Box)
  const [note, setNote] = useState(null);
  // After clicking save text button in 1st box the text is stored in savedNotes and displayed in 2nd box.
  //Variable to be passes to summarize : savedNotes
  const [savedNotes, setSavedNotes] = useState(["Engineering is a field of boundless innovation and problem-solving that shapes the world we live in. Engineers are the architects of progress, designing and building the infrastructure, technology, and solutions that drive society forward. Whether it's civil engineers constructing towering skyscrapers and intricate bridges, electrical engineers revolutionizing communication and energy systems, or software engineers developing the digital tools of tomorrow, their work touches every aspect of our lives. Beyond the technical expertise, engineers possess a unique ability to tackle complex challenges with creativity and precision, seeking sustainable solutions that improve the quality of life for all. In an ever-evolving world, engineering remains a driving force, continuously pushing the boundaries of what is possible and inspiring generations to dream, innovate, and build a brighter future."
  ])
  // To toogle the state of start or stop button
  const [state, setState] = useState(false);
  //For saving as .txt
  const textToSave = savedNotes;
  const pause=0

  // To set summarize
  const [summarize, setSummarize] = useState(null);

  const Toggle = () => {
    setState(!state);
  };

  const Clear = () => {
    setSavedNotes([]);
  };

  const clear = () => {
    setNote([]);
  };

  const clr = () => {
    setSummarize([]);
  };

  const Clr = () => {
    
  };

  useEffect(() => {
    const handleListen = () => {
      if (isListening) {
        mic.start();
        mic.onend = () => {
          console.log("continue..");
          mic.start();
        };
      } else {
        mic.stop();
        mic.onend = () => {
          console.log("Stopped Mic on Click");
        };
      }
      mic.onstart = () => {
        console.log("Mics on");
      };

      mic.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("");
        console.log(transcript);
        setNote(transcript);


        
        mic.onerror = (event) => {
          console.log(event.error);
        };
      };
    };

    handleListen();
  }, [isListening]);

  function saveToFile(text) {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "file.txt");
  }

  const handleSaveNote = () => {
    setSavedNotes([...savedNotes, note]);

    setNote("");
  };

  //To summarize the given text
  const summarizeText = async () => {
    const textToSummarize = savedNotes;
    const response = await axios.post(
      "http://localhost:5000/summarize",
      {
        Text: textToSummarize,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Handle the response, e.g., log the summarized text
     setSummarize(response.data)
  };

  return (
    <>
      <h1>Speech Recogonition</h1>
      <div className="container">
        <div className="box">
          <h2>Current speech text</h2>
          <label>
              Language:
            <select>
            <option>English</option>
            <option>Malayalam</option>
            <option>Hindi</option>
            </select>
            </label>
          {isListening ? <span>🎙️Recording....</span> : <span>🛑🎙️</span>}
          <button onClick={handleSaveNote} disabled={!note}>
            Save text
          </button>
          <button
            onClick={() => {
              setIsListening((prevState) => !prevState);
              Toggle();
            }}
          >
            {state ? "Stop " : "Start"}
          </button>
          <button onClick={clear} disabled={!note}>
            Clear
          </button>
          <p>{note}</p>
        </div>
        <div className="box">
          <h2>Saved Text</h2>
          <button
            onClick={() => {
              summarizeText();
            }}
          >
            Summarize
          </button>
          <button onClick={Clear} disabled={!savedNotes}>Clear</button>
          <button onClick={() => saveToFile(textToSave)} disabled={!savedNotes}>
            Save
          </button>
          {savedNotes.map((n) => (
            <p key={n}>{n}</p>
          ))}
        </div>
        <div className="box">
          <h2>Summarize</h2>
          <button onClick={clr} disabled={!summarize}>Clear</button>
          <button onClick={() => saveToFile(textToSave)} disabled={!summarize}>
            Save
          </button>
          <p>{summarize}</p>
        </div>
        <div className="box">
          <h2>Translated Text</h2>
          <button onClick={() => saveToFile(textToSave)} disabled={!savedNotes}>
            Save
          </button>
          <button>
            Translate
          </button>
          <label>
             🗣️Language:
            <select>
            <option>English</option>
            <option>Malayalam</option>
            <option>Hindi</option>
            </select>
            </label>
            <button onClick={Clr}>
            Clear
          </button>
        </div>
      </div>
    </>
  );
}

export default App;

// "Engineering is a field of boundless innovation and problem-solving that shapes the world we live in. Engineers are the architects of progress, designing and building the infrastructure, technology, and solutions that drive society forward. Whether it's civil engineers constructing towering skyscrapers and intricate bridges, electrical engineers revolutionizing communication and energy systems, or software engineers developing the digital tools of tomorrow, their work touches every aspect of our lives. Beyond the technical expertise, engineers possess a unique ability to tackle complex challenges with creativity and precision, seeking sustainable solutions that improve the quality of life for all. In an ever-evolving world, engineering remains a driving force, continuously pushing the boundaries of what is possible and inspiring generations to dream, innovate, and build a brighter future."