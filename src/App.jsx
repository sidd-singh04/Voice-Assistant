import React, { useEffect, useState } from "react";
import Ai from './ai.gif';

const App = () => {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [information, setInformation] = useState("");
  const [voices, setVoices] = useState([]);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  const loadVoice = () => {
    const allVoices = window.speechSynthesis.getVoices();
    setVoices(allVoices);
  };

  useEffect(() => {
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoice;
    } else {
      loadVoice();
    }
  }, []);

  const startListening = () => {
    recognition.start();
    setIsListening(true);
  };

  recognition.onresult = (event) => {
    const spokenText = event.results[0][0].transcript.toLowerCase();
    setTranscript(spokenText);
    handleVoiceCommand(spokenText);
  };

  recognition.onend = () => setIsListening(false);

  const speakText = (text) => {
    if (voices.length === 0) {
      console.warn("No voice available yet.");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);

    const maleEnglishVoice =
      voices.find((voice) => voice.lang.startsWith("en-") && voice.name.toLowerCase().includes("male")) ||
      voices.find((voice) => voice.lang.startsWith("en-")) ||
      voices[0];

    utterance.voice = maleEnglishVoice;
    utterance.lang = maleEnglishVoice.lang || "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    window.speechSynthesis.speak(utterance);
  };

  const handleVoiceCommand = async (command) => {
    if (command.startsWith("open ")) {
      const site = command.split("open ")[1].trim();
      const sitesMap = `https://www.${site}.com`;

      if (site) {
        speakText(`Opening ${site}`);
        window.open(sitesMap, "_blank");
        setInformation(`Opened ${site}`);
      } else {
        speakText(`I don't know how to open ${site}`);
        setInformation(`Could not find the website for ${site}`);
      }
      return;
    }

    if (command.includes("translate")) {
      const regex = /translate (.+?) to (\w+)/i;
      const match = command.match(regex);

      if (match && match.length === 3) {
        const word = match[1].trim();
        const language = match[2].trim();
        speakText(`Translating ${word} to ${language}`);
        setInformation(`Translating ${word} to ${language}`);
        window.open(`https://translate.google.com/?sl=auto&tl=${language}&text=${encodeURIComponent(word)}&op=translate`, "_blank");
      } else {
        speakText("Please say something like 'Translate hello to Hindi'");
        setInformation("Try saying: Translate hello to Hindi");
      }
      return;
    }

    if (command.includes("bye") || command.includes("goodbye") || command.includes("see you") || command.includes("talk to you later")) {
      const response = "Goodbye! Have a great day ahead!";
      speakText(response);
      setInformation(response);
      return;
    }

    if (command.includes("introduce")) {
      const response = "Hello Sir, I'm Friday, your personal voice assistant created by Siddharth to help you with tasks using speech commands.";
      speakText(response);
      setInformation(response);
      return;
    }

    if (command.includes("hello")) {
      const response = "Hello Sir, I'm Friday. How can I help you?";
      speakText(response);
      setInformation(response);
      return;
    }

    if (command.includes("your age")) {
      const response = "I am an AI assistant and don't have an age.";
      speakText(response);
      setInformation(response);
      return;
    }

    if (command.includes("who are you")) {
      const response = "I'm Friday, your smart AI assistant.";
      speakText(response);
      setInformation(response);
      return;
    }

    if (command.includes("your name")) {
      const response = "My name is Friday, your virtual assistant.";
      speakText(response);
      setInformation(response);
      return;
    }

    if (command.includes("created you")) {
      const response = "I was created by Siddharth, a brilliant developer.";
      speakText(response);
      setInformation(response);
      return;
    }

    if (command.includes("are you real")) {
      const response = "I'm real in your device, but not in the physical world.";
      speakText(response);
      setInformation(response);
      return;
    }

    if (command.includes("have emotions")) {
      const response = "No, I don't have emotions, but I try to sound friendly!";
      speakText(response);
      setInformation(response);
      return;
    }

    if (command.includes("have a body")) {
      const response = "Nope, I'm just a voice in your digital world.";
      speakText(response);
      setInformation(response);
      return;
    }

    if (command.includes("time")) {
      const response = new Date().toLocaleTimeString();
      speakText(`The time is ${response}`);
      setInformation(`The time is ${response}`);
      return;
    }

    if (command.includes("date")) {
      const response = new Date().toDateString();
      speakText(`Today is ${response}`);
      setInformation(`Today is ${response}`);
      return;
    }

    if (command.includes("day")) {
      const response = new Date().toLocaleDateString(undefined, { weekday: "long" });
      speakText(`Today is ${response}`);
      setInformation(`Today is ${response}`);
      return;
    }

    if (command.includes("what can you do")) {
      const response = `I can assist you with various tasks like opening websites, telling the current time, date, and day, showing maps, telling jokes, providing interesting number facts, giving weather updates, translating words, explaining meanings, and answering general questions.`;
      speakText(response);
      setInformation(response);
      return;
    }

    if (command.includes("map")) {
      const location = command.replace(/.*map of/gi, "").trim();
      if (location) {
        const mapUrl = `https://www.google.com/maps/search/${encodeURIComponent(location)}`;
        speakText(`Showing map of ${location}`);
        setInformation(`Map of ${location}`);
        window.open(mapUrl, "_blank");
        return;
      }
    }

    if (command.includes("joke") || command.includes("funny") || command.includes("laugh")) {
      const url = "https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=single";
      try {
        const response = await fetch(url);
        const data = await response.json();
        const joke = data.joke;

        speakText(joke);
        setInformation(joke);
      } catch (error) {
        const fallback = "Sorry, I couldn't fetch a joke right now.";
        speakText(fallback);
        setInformation(fallback);
      }
      return;
    }

    if (command.includes("meaning of ")) {
      const word = command.replace("meaning of ", "").trim();
      speakText(`Searching the meaning of ${word}`);
      setInformation(`Searching the meaning of ${word}`);
      performGoogleSearch(`define ${word}`);
      return;
    }

    if (command.includes("weather in")) {
      const location = command.split("weather in")[1]?.trim();
      if (location) {
        const url = `https://www.google.com/search?q=weather+in+${encodeURIComponent(location)}`;
        speakText(`Here's the weather update for ${location}`);
        window.open(url, "_blank");
      } else {
        speakText("Please say 'weather in' followed by the location.");
      }
      return;
    }

    if (command.includes("battery")) {
      navigator.getBattery().then(battery => {
        const percent = Math.round(battery.level * 100);
        let response = `Battery is at ${percent} percent. `;

        if (percent === 100) {
          response += "You are good to go!";
        } else if (percent >= 75) {
          response += "You have plenty of battery left.";
        } else if (percent >= 50) {
          response += "Battery is decent, but consider charging soon.";
        } else if (percent >= 20) {
          response += "Battery is getting low, please charge soon.";
        } else {
          response += "Battery is very low, please charge immediately!";
        }

        speakText(response);
        setInformation(response);
      });
      return;
    }

    if (command.includes("number fact") || command.includes("number") || command.includes("tell me a fact") || command.includes("trivia about")) {
      const numberMatch = command.match(/\d+/);
      const number = numberMatch ? numberMatch[0] : "random";

      const url = `http://numbersapi.com/${number}/trivia?json`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        speakText(data.text);
        setInformation(data.text);
      } catch (error) {
        const fallback = "Sorry, I couldn't fetch a number fact right now.";
        speakText(fallback);
        setInformation(fallback);
      }
      return;
    }

    const cleanedQuery = command.replace(/do you know( about)?|give me details about |tell me about |what is an |what is a |who is |what is /gi, "").trim();

    const personData = await fetchPersonData(cleanedQuery);

    if (personData) {
      const infoText = `${personData.name}, ${personData.extract}`;
      setInformation(infoText);
      speakText(infoText);
    } else {
      const fallbackMessage = "I'm not sure about that. Let me search it for you.";
      speakText(fallbackMessage);
      setInformation(fallbackMessage);
      performGoogleSearch(command);
    }
  };

  const fetchPersonData = async (person) => {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(person)}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data && data.title && data.extract && !data.extract.includes("may refer to")) {
        return {
          name: data.title,
          extract: data.extract.split(".")[0],
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Wikipedia fetch error:", error);
      return null;
    }
  };

  const performGoogleSearch = (query) => {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    window.open(searchUrl, "_blank");
  };

  return (
    <div>
      <div className="voice-assistant">
        <img src={Ai} alt="AI" className="ai-image" />
        <h2>Friday : Your Personal Voice Assistant</h2>
        <button className="btn" onClick={startListening} disabled={isListening}>
          <i className="fas fa-microphone"></i>
          {isListening ? "Listening..." : "Start Listening"}
        </button>
        <p className="transcript">{transcript}</p>
        <p className="information">{information}</p>
      </div>
    </div>
  );
};

export default App;




