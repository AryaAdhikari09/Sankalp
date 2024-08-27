import createSpeechServicesPonyfill from "web-speech-cognitive-services";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import WordGrid from "./Test/WordGrid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "../styles/Test.module.css";
import AfterTest from "./Test/AfterTest";

import { backendIp } from "../VALUE";

const SUBSCRIPTION_KEY = "89cb06294f424d139909619564deba2d";
const REGION = "eastus";

const { SpeechRecognition: AzureSpeechRecognition } =
  createSpeechServicesPonyfill({
    credentials: {
      region: REGION,
      subscriptionKey: SUBSCRIPTION_KEY,
    },
  });
SpeechRecognition.applyPolyfill(AzureSpeechRecognition);

function Test() {
  const [givingTest, setGivingTest] = useState("true");
  const [cleanedArray, setCleanedArray] = useState([]);
  const [age, setAge] = useState(0);
  const [score, setScore] = useState(0);
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    setUsername(localStorage.getItem("name"));

    if (localStorage.getItem("name") === null) {
      navigate("/");
    }
    if (localStorage.getItem("token") === "") {
      navigate("/");
    }
  }, [navigate]);

  const startListening = () =>
    SpeechRecognition.startListening({ language: "en-IN" });
  const stopListening = () => SpeechRecognition.stopListening();
  const { transcript, browserSupportsSpeechRecognition, listening } =
    useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesnt support speech recognition.</span>;
  }

  const [response, setResponse] = useState(null);

const handlesubmit = async () => {
  console.log("Original Transcript:", transcript);
  setGivingTest(false);

  // Split transcript into words
  let arr = transcript.split(" ");

  // Filter out words that are entirely uppercase (likely spelled out)
  arr = arr.filter((word) => {
    if (word === word.toUpperCase()) {
      console.log(`Spelt out word detected: ${word}, excluded.`);
      return false;
    }
    return true;
  });

  // Clean up the remaining words
  arr = arr.map((str) => str.replace(/[^a-zA-Z]/g, "").toLowerCase());

  console.log("Cleaned Words Array:", arr); // Debugging output

  // Proceed to check the remaining words
  const { score, age, correctWords, incorrectWords } = await checkWords(arr);

  setScore(score);
  setAge(age);
  console.log("Final Score:", score); // Log the final score
  console.log("Reading Age:", age); // Log the reading age

  try {
    const responseFromApi = await fetch(`${backendIp}/api/result/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: username,
        score,
        age,
        correctWords,
        incorrectWords,
      }), // Send correct and incorrect words
    });

    if (responseFromApi.status === 200) {
      const data = await responseFromApi.json();
      console.log("Response Data:", data); // Log the response data
      setResponse(data); // Set the response state
    } else {
      console.error("Error Response:", responseFromApi); // Log any error response
      setResponse({ error: "Failed to submit test results" }); // Set error response state
    }
  } catch (error) {
    console.error("Error submitting test results:", error); // Log any error
    setResponse({ error: "Failed to submit test results" }); // Set error response state
  }
};

  const checkWords = async (words) => {
    let score = 0;
    let correctWords = []; // Array to store correct words
    let incorrectWords = []; // Array to store incorrect words

    const flatWordsGrid = wordsGrid.flat();

    for (let i = 0; i < words.length; i++) {
      let word = words[i].toLowerCase();

      if (flatWordsGrid.includes(word)) {
        score++;
        correctWords.push(word); // Store correct words
        console.log(`Matched Word: ${word}, Current Score: ${score}`); // Log each matched word and the current score
      } else {
        incorrectWords.push(word); // Store incorrect words
        console.log(`Word "${word}" is either incorrect or out of expected order.`);
      }
    }

    const tempAge = getReadingAge(score);
    return { score, age: tempAge, correctWords, incorrectWords };
  };

  const getReadingAge = (score1) => {
    console.log(score1);
    const match = readingAgeMap.find((entry) => entry.score === score1);
    console.log(match);
    return match ? match.age : "N/A";
  };

  return (
    <>
      {!isMobile && (
        <div className={`${styles.container} ${givingTest ? styles.giveHeight : ''}`}>
          {givingTest && (
            <div className={styles.testBox}>
              <p
                className={`${styles.microphoneStatus} ${listening ? styles.micOn : styles.micOff
                  }`}
              >
                Microphone is: {listening ? "on" : "off"}
              </p>
              <WordGrid />
              <div>
                <div className={styles.buttonBox}>
                  <button onClick={startListening}>Start Reading</button>
                  <button onClick={stopListening}>Stop Reading</button>
                  <button onClick={handlesubmit}>Submit</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {isMobile && (
        <div className={styles.mobileContainer}>
          <h1>Mobile devices are not supported</h1>
        </div>
      )}
      {!givingTest && response && (
        <AfterTest
          username={username}
          score={response ? response.score : 0}
          age={age}
          correctWords={response ? response.correctWords : []}
          incorrectWords={response ? response.incorrectWords : []}
        />
      )}
    </>
  );
}

export default Test;

const readingAgeMap = [
  { score: 0, age: "6.0 minus" },
  { score: 1, age: "6.0 minus" },
  { score: 2, age: "6.0" },
  { score: 3, age: "6.2" },
  { score: 4, age: "6.4" },
  { score: 5, age: "6.5" },
  { score: 6, age: "6.6" },
  { score: 7, age: "6.7" },
  { score: 8, age: "6.7" },
  { score: 9, age: "6.8" },
  { score: 10, age: "6.9" },
  { score: 11, age: "6.10" },
  { score: 12, age: "6.10" },
  { score: 13, age: "6.11" },
  { score: 14, age: "6.11" },
  { score: 15, age: "7.0" },
  { score: 16, age: "7.1" },
  { score: 17, age: "7.2" },
  { score: 18, age: "7.2" },
  { score: 19, age: "7.3" },
  { score: 20, age: "7.4" },
  { score: 21, age: "7.4" },
  { score: 22, age: "7.5" },
  { score: 23, age: "7.5" },
  { score: 24, age: "7.6" },
  { score: 25, age: "7.7" },
  { score: 26, age: "7.7" },
  { score: 27, age: "7.8" },
  { score: 28, age: "7.9" },
  { score: 29, age: "7.10" },
  { score: 30, age: "8.0" },
  { score: 31, age: "8.1" },
  { score: 32, age: "8.2" },
  { score: 33, age: "8.3" },
  { score: 34, age: "8.4" },
  { score: 35, age: "8.5" },
  { score: 36, age: "8.6" },
  { score: 37, age: "8.6" },
  { score: 38, age: "8.7" },
  { score: 39, age: "8.8" },
  { score: 40, age: "8.9" },
  { score: 41, age: "8.10" },
  { score: 42, age: "8.11" },
  { score: 43, age: "9.0" },
  { score: 44, age: "9.1" },
  { score: 45, age: "9.2" },
  { score: 46, age: "9.3" },
  { score: 47, age: "9.4" },
  { score: 48, age: "9.5" },
  { score: 49, age: "9.6" },
  { score: 50, age: "9.6" },
  { score: 51, age: "9.7" },
  { score: 52, age: "9.8" },
  { score: 53, age: "9.9" },
  { score: 54, age: "9.10" },
  { score: 55, age: "9.11" },
  { score: 56, age: "10.0" },
  { score: 57, age: "10.1" },
  { score: 58, age: "10.1" },
  { score: 59, age: "10.2" },
  { score: 60, age: "10.3" },
  { score: 61, age: "10.4" },
  { score: 62, age: "10.5" },
  { score: 63, age: "10.6" },
  { score: 64, age: "10.7" },
  { score: 65, age: "10.8" },
  { score: 66, age: "10.9" },
  { score: 67, age: "10.10" },
  { score: 68, age: "11.0" },
  { score: 69, age: "11.1" },
  { score: 70, age: "11.3" },
  { score: 71, age: "11.4" },
  { score: 72, age: "11.5" },
  { score: 73, age: "11.6" },
  { score: 74, age: "11.8" },
  { score: 75, age: "11.10" },
  { score: 76, age: "12.0" },
  { score: 77, age: "12.1" },
  { score: 78, age: "12.2" },
  { score: 79, age: "12.3" },
  { score: 80, age: "12.4" },
  { score: 81, age: "12.5" },
  { score: 82, age: "12.6" },
  { score: 83, age: "12.6+" },
  { score: 84, age: "12.6+" },
  { score: 85, age: "12.6+" },
  { score: 86, age: "12.6+" },
  { score: 87, age: "12.6+" },
  { score: 88, age: "12.6+" },
  { score: 89, age: "12.6+" },
  { score: 90, age: "12.6+" },
  { score: 91, age: "12.6+" },
  { score: 92, age: "12.6+" },
  { score: 93, age: "12.6+" },
  { score: 94, age: "12.6+" },
  { score: 95, age: "12.6+" },
  { score: 96, age: "12.6+" },
  { score: 97, age: "12.6+" },
  { score: 98, age: "12.6+" },
  { score: 99, age: "12.6+" },
  { score: 100, age: "12.6+" },
];


const wordsGrid = [
  ["tree", "little", "milk", "egg", "book"],            // Row 1
  ["school", "sit", "frog", "playing", "bun"],          // Row 2
  ["flower", "road", "clock", "train", "light"],        // Row 3
  ["picture", "think", "summer", "people", "something"],// Row 4
  ["dream", "downstairs", "biscuit", "shepherd", "thirsty"], // Row 5
  ["crowd", "sandwich", "beginning", "postage", "island"],   // Row 6
  ["saucer", "angel", "sailing", "appeared", "knife"],       // Row 7
  ["canary", "attractive", "imagine", "nephew", "gradually"],// Row 8
  ["smoulder", "applaud", "disposal", "nourished", "diseased"], // Row 9
  ["university", "orchestra", "knowledge", "audience", "situated"], // Row 10
  ["physics", "campaign", "choir", "intercede", "fascinate"], // Row 11
  ["forfeit", "siege", "pavement", "plausible", "prophecy"],  // Row 12
  ["colonel", "soloist", "systematic", "slovenly", "classification"], // Row 13
  ["genuine", "institution", "pivot", "conscience", "heroic"], // Row 14
  ["pneumonia", "preliminary", "antique", "susceptible", "enigma"],   // Row 15
  ["oblivion", "scintillate", "satirical", "sabre", "beguile"],  // Row 16
  ["terrestrial", "belligerent", "adamant", "sepulchre", "statistics"], // Row 17
  ["miscellaneous", "procrastinate", "tyrannical", "evangelical", "grotesque"], // Row 18
  ["ineradicable", "judicature", "preferential", "homonym", "fictitious"], // Row 19
  ["rescind", "metamorphosis", "somnambulist", "bibliography", "idiosyncrasy"]  // Row 20
];