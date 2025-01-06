import React, { useState, useEffect } from 'react';
import { MainUrl } from '#c/functions/index';

// Map of note keys and corresponding sound file names
const noteMap = {
  'A': 'a',
  'W': 'w',
  'S': 's',
  'E': 'e',
  'D': 'd',
  'F': 'f',
  'T': 't',
  'G': 'g',
  'Y': 'y',
  'H': 'h',
  'U': 'u',
  'J': 'j',
  'K': 'k',
  'L': 'l',
  'O': 'o',
  'P': 'p',
  '_': '_'
};

const Piano = () => {
  const [isActive, setIsActive] = useState({});
  const [sounds, setSounds] = useState({});
  const [isLoaded, setIsLoaded] = useState(false); // Track if all sounds are loaded

  // Open an IndexedDB database to store audio files
  const openDatabase = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('pianoSoundsDB', 1);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        // Create an object store for sounds if it doesn't exist
        if (!db.objectStoreNames.contains('sounds')) {
          db.createObjectStore('sounds', { keyPath: 'note' });
        }
      };

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  };

  // Save the sound Blob to IndexedDB
  const saveSoundToDB = (db, note, audioBlob) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('sounds', 'readwrite');
      const store = transaction.objectStore('sounds');
      store.put({ note, audioBlob });
      transaction.oncomplete = resolve;
      transaction.onerror = reject;
    });
  };

  // Load the sound Blob from IndexedDB
  const loadSoundFromDB = (db, note) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('sounds', 'readonly');
      const store = transaction.objectStore('sounds');
      const request = store.get(note);
      request.onsuccess = (event) => {
        resolve(event.target.result ? event.target.result.audioBlob : null);
      };
      request.onerror = reject;
    });
  };

  // Fetch the audio file as a Blob
  const fetchAudioAsBlob = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return blob;
  };

  // Preload sounds and store/load them from IndexedDB
  useEffect(() => {
    const preloadSounds = async () => {
      const db = await openDatabase();
      const soundFiles = {};

      for (const note in noteMap) {
        const cachedSound = await loadSoundFromDB(db, note);
        if (cachedSound) {
          // If sound is cached in IndexedDB, use it
          soundFiles[note] = cachedSound;
        } else {
          // If sound is not cached, fetch it and store it in IndexedDB
          const audioBlob = await fetchAudioAsBlob(`${MainUrl}/mp3tunes/${noteMap[note]}.mp3`);
          soundFiles[note] = audioBlob;
          await saveSoundToDB(db, note, audioBlob); // Save the sound to IndexedDB for future use
        }
      }

      setSounds(soundFiles);
      setIsLoaded(true); // Set isLoaded to true once all sounds are preloaded
    };

    preloadSounds();
  }, []);

  // Play sound based on the note passed
  const playSound = (note) => {
    if (sounds[note]) {
      const audio = new Audio(URL.createObjectURL(sounds[note])); // Create a new audio object from the Blob
      audio.play();
    }

    // Add visual feedback to the pressed key
    setIsActive((prevState) => ({
      ...prevState,
      [note]: true
    }));

    setTimeout(() => {
      setIsActive((prevState) => ({
        ...prevState,
        [note]: false
      }));
    }, 150); // Duration for key press effect
  };

  // Handle click event for piano keys
  const handleClick = (note) => {
    playSound(note);
  };

  // Add event listener for key press to play piano keys using keyboard
  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toUpperCase();
      if (noteMap[key]) {
        playSound(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!isLoaded) {
    // Show a loading state if sounds are not loaded
    return <div className="loading">Loading Piano...</div>;
  }

  return (
    <div className="wrapper">
      <ul className="piano-keys">
        {/* Static list of piano keys */}
        <li
          className={`key white ${isActive['A'] ? 'active' : ''}`}
          data-key="A"
          onClick={() => handleClick('A')}
        >
          <span>A</span>
        </li>
        <li
          className={`key black ${isActive['W'] ? 'active' : ''}`}
          data-key="W"
          onClick={() => handleClick('W')}
        >
          <span>W</span>
        </li>
        <li
          className={`key white ${isActive['S'] ? 'active' : ''}`}
          data-key="S"
          onClick={() => handleClick('S')}
        >
          <span>S</span>
        </li>
        <li
          className={`key black ${isActive['E'] ? 'active' : ''}`}
          data-key="E"
          onClick={() => handleClick('E')}
        >
          <span>E</span>
        </li>
        <li
          className={`key white ${isActive['D'] ? 'active' : ''}`}
          data-key="D"
          onClick={() => handleClick('D')}
        >
          <span>D</span>
        </li>
        <li
          className={`key white ${isActive['F'] ? 'active' : ''}`}
          data-key="F"
          onClick={() => handleClick('F')}
        >
          <span>F</span>
        </li>
        <li
          className={`key black ${isActive['T'] ? 'active' : ''}`}
          data-key="T"
          onClick={() => handleClick('T')}
        >
          <span>T</span>
        </li>
        <li
          className={`key white ${isActive['G'] ? 'active' : ''}`}
          data-key="G"
          onClick={() => handleClick('G')}
        >
          <span>G</span>
        </li>
        <li
          className={`key black ${isActive['Y'] ? 'active' : ''}`}
          data-key="Y"
          onClick={() => handleClick('Y')}
        >
          <span>Y</span>
        </li>
        <li
          className={`key white ${isActive['H'] ? 'active' : ''}`}
          data-key="H"
          onClick={() => handleClick('H')}
        >
          <span>H</span>
        </li>
        <li
          className={`key black ${isActive['U'] ? 'active' : ''}`}
          data-key="U"
          onClick={() => handleClick('U')}
        >
          <span>U</span>
        </li>
        <li
          className={`key white ${isActive['J'] ? 'active' : ''}`}
          data-key="J"
          onClick={() => handleClick('J')}
        >
          <span>J</span>
        </li>
        <li
          className={`key white ${isActive['K'] ? 'active' : ''}`}
          data-key="K"
          onClick={() => handleClick('K')}
        >
          <span>K</span>
        </li>
        <li
          className={`key black ${isActive['O'] ? 'active' : ''}`}
          data-key="O"
          onClick={() => handleClick('O')}
        >
          <span>O</span>
        </li>
        <li
          className={`key white ${isActive['L'] ? 'active' : ''}`}
          data-key="L"
          onClick={() => handleClick('L')}
        >
          <span>L</span>
        </li>
        <li
          className={`key black ${isActive['P'] ? 'active' : ''}`}
          data-key="P"
          onClick={() => handleClick('P')}
        >
          <span>P</span>
        </li>
        <li
          className={`key white ${isActive['_'] ? 'active' : ''}`}
          data-key="_"
          onClick={() => handleClick('_')}
        >
          <span>;</span>
        </li>
      </ul>
    </div>
  );
};

export default Piano;
