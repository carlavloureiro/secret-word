//CSS
import './App.css'
//React
import { useCallback, useEffect, useState } from 'react'
//Data
import {wordsList} from './data/words'
//Components
import StartScreen from './components/StartScreen'
import Game from './components/Game'
import GameOver from './components/GameOver'

const stages = [
  {id: 1, name: "start"},
  {id: 2, name: "game"},
  {id: 3, name: "end"},
]

const guessesQty = 3;

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(0);

  const pickWordAndCategory = useCallback(() => {
    //Escolhe uma categoria aleatória
    const categories = Object.keys(words);
    const category = categories[Math.floor(Math.random() * Object.keys(categories.length))];

    //Escolhe uma palavra aleatória
    const word = words[category][Math.floor(Math.random() * words[category].length)];

    return{ word, category };
  }, [words]);

  //Começa o jogo
  const startGame = useCallback(() => {
    clearLetterStates();

    const { word, category } = pickWordAndCategory();

    //Cria um array de letras, conforme a palavra escolhida
    let wordLetters = word.split("");

    wordLetters = wordLetters.map((l) => l.toLowerCase());
    
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  //Processa a letra no input
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();

    //Checa se a letra já foi utilizada
    if (guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)) {
      return;
    };

    //Adiciona em "guessed letters" ou remove uma tentativa 
    if(letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter,
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]);  
      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  };

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  }

  //Checa a condição de vitória
  useEffect(() => {
    const uniqueLetters = [... new Set(letters)];

    if (guessedLetters.length === uniqueLetters.length) {
      //Atribui pontuação
      setScore((actualScore) => actualScore += 100);

      //Recomeça o jogo com uma nova palavra
      startGame();
    }

    console.log(uniqueLetters);
  }, [guessedLetters])


  //Checa se as tentativas se esgotaram
  useEffect(() => {
    if (guesses <= 0) {
      //Reseta todos os states
      clearLetterStates();
      setGameStage(stages[2].name);
    };
  }, [guesses])


  //Recomeça o jogo
  const retry = () => {
    setScore(0);
    setGuesses(guessesQty);

    setGameStage(stages[0].name);
  };

  return (
    <>
      <div className='app'>
        { /* a tela de inicio só será exibida quando o gamestage for start */ }
        {gameStage === "start" && <StartScreen startGame={startGame}/>}
        {gameStage === "game" && (
            <Game 
              verifyLetter={verifyLetter} 
              pickedWord={pickedWord} 
              pickedCategory={pickedCategory} 
              letters={letters}
              guessedLetters={guessedLetters}
              wrongLetters={wrongLetters}
              guesses={guesses}
              score={score}
            />
        )}
        {gameStage === "end" && <GameOver retry={retry} score={score}/>}
      </div>
    </>
  )
}

export default App
