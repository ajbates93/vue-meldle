import { addDays } from 'date-fns'

const words = [
  {word: "melba", date: new Date("02/04/2022").toDateString()}, 
  {word: "norks", date: new Date("02/05/2022").toDateString()}, 
  {word: "melee", date: new Date("02/06/2022").toDateString()}, 
  {word: "wench", date: new Date("02/07/2022").toDateString()}, 
  {word: "melts", date: new Date("02/08/2022").toDateString()}, 
  {word: "timmy", date: new Date("02/09/2022").toDateString()}, 
  {word: "melon", date: new Date("02/10/2022").toDateString()},
  {word: "elite", date: new Date("02/11/2022").toDateString()},
  {word: "smell", date: new Date("02/12/2022").toDateString()},
  {word: "haway", date: new Date("02/13/2022").toDateString()},
  {word: "AROSE", date: new Date("02/14/2022").toDateString()},
  {word: "TRISS", date: new Date("02/15/2022").toDateString()},
  {word: "NORSE", date: new Date("02/16/2022").toDateString()},
  {word: "RUGBY", date: new Date("02/17/2022").toDateString()},
  {word: "FRANK", date: new Date("02/18/2022").toDateString()},
  {word: "SWORD", date: new Date("02/19/2022").toDateString()},
  {word: "STOUT", date: new Date("02/20/2022").toDateString()},
  {word: "GRUNT", date: new Date("02/21/2022").toDateString()},
  {word: "BUXOM", date: new Date("02/22/2022").toDateString()},
  {word: "SHEEP", date: new Date("02/23/2022").toDateString()},
  {word: "LUNNY", date: new Date("02/24/2022").toDateString()},
  {word: "FAITH", date: new Date("02/25/2022").toDateString()},
  {word: "BRUSH", date: new Date("02/26/2022").toDateString()},
  {word: "TROUT", date: new Date("02/27/2022").toDateString()},
  {word: "BASIL", date: new Date("02/28/2022").toDateString()},
  {word: "MATER", date: new Date("03/01/2022").toDateString()},
  {word: "GANKS", date: new Date("03/02/2022").toDateString()},
  {word: "CYBER", date: new Date("03/03/2022").toDateString()},
  {word: "PLANE", date: new Date("03/04/2022").toDateString()},
  {word: "BEERS", date: new Date("03/05/2022").toDateString()},
  {word: "LENIN", date: new Date("03/06/2022").toDateString()},
  {word: "TRAIN", date: new Date("09/23/2022").toDateString()},
  {word: "FRANK", date: new Date("09/24/2022").toDateString()},
  {word: "WENCH", date: new Date("09/25/2022").toDateString()},
];

const validateGuess = async (guess) => {
  const lc = guess.toLowerCase()
  
  const allowed = await fetch('allowed.txt')
    .then(response => response.text())
  
  const aWords = allowed.replace(/(\r\n|\n|\r)/gm, "");

  const valid = aWords.includes(lc)
  return valid
}

const getIndex = (date) => {
  let start = new Date(2022, 0, 0)
  let index = -1
  do {
    index++
    start = addDays(start, 1)
  } while (start <= date)

  return index
} 

const getWordOfTheDay = async (date) => {
  const customWordIndex = words.findIndex(x => x.date == date)
  if (customWordIndex === -1) {
    const wordIndex = getIndex(date)
    const wotd = JSON.parse(localStorage.getItem("meldle-wotd"))
    if (!wotd || wotd.date !== date) {
      const answers = await fetch('answers.txt')
        .then(response => response.text())
  
      const aWords = answers.replace(/(\r\n|\n|\r)/gm, "\n")
      const lines = aWords.split('\n')
      // const random = lines[Math.floor(Math.random() * lines.length)].toUpperCase()
      const wordFromList = lines[wordIndex % lines.length]
      const word = { word: wordFromList, date: new Date().toDateString() }
      
      setWordOfTheDay(word)

      return word.word
    }
    else 
      return wotd.word
  }
  else {
    const word = { word: words[customWordIndex].word, date: new Date().toDateString() }
    setWordOfTheDay(word)
    return word.word
  }
}

const setWordOfTheDay = (word) => {
  localStorage.setItem("meldle-wotd", JSON.stringify(word))
}

export { getWordOfTheDay, validateGuess }