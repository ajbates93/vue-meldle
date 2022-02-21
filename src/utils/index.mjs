import { convertToUTCDate } from "../composables";

const words = [
  {word: "melba", date: convertToUTCDate(new Date("02/04/2022"))}, 
  {word: "norks", date: convertToUTCDate(new Date("02/05/2022"))}, 
  {word: "melee", date: convertToUTCDate(new Date("02/06/2022"))}, 
  {word: "wench", date: convertToUTCDate(new Date("02/07/2022"))}, 
  {word: "melts", date: convertToUTCDate(new Date("02/08/2022"))}, 
  {word: "timmy", date: convertToUTCDate(new Date("02/09/2022"))}, 
  {word: "melon", date: convertToUTCDate(new Date("02/10/2022"))},
  {word: "elite", date: convertToUTCDate(new Date("02/11/2022"))},
  {word: "smell", date: convertToUTCDate(new Date("02/12/2022"))},
  {word: "haway", date: convertToUTCDate(new Date("02/13/2022"))},
  {word: "AROSE", date: convertToUTCDate(new Date("02/14/2022"))},
  {word: "TRISS", date: convertToUTCDate(new Date("02/15/2022"))},
  {word: "NORSE", date: convertToUTCDate(new Date("02/16/2022"))},
  {word: "RUGBY", date: convertToUTCDate(new Date("02/17/2022"))},
  {word: "FRANK", date: convertToUTCDate(new Date("02/18/2022"))},
  {word: "SWORD", date: convertToUTCDate(new Date("02/19/2022"))},
  {word: "STOUT", date: convertToUTCDate(new Date("02/20/2022"))},
  {word: "GRUNT", date: convertToUTCDate(new Date("02/21/2022"))},
  {word: "BUXOM", date: convertToUTCDate(new Date("02/22/2022"))},
  {word: "SHEEP", date: convertToUTCDate(new Date("02/23/2022"))},
  {word: "LUNNY", date: convertToUTCDate(new Date("02/24/2022"))},
  {word: "FAITH", date: convertToUTCDate(new Date("02/25/2022"))},
  {word: "BRUSH", date: convertToUTCDate(new Date("02/26/2022"))},
  {word: "TROUT", date: convertToUTCDate(new Date("02/27/2022"))},
  {word: "BASIL", date: convertToUTCDate(new Date("02/28/2022"))},
];

const validateGuess = async (guess) => {
  const lc = guess.toLowerCase()
  
  const allowed = await fetch('allowed.txt')
    .then(response => response.text())
  
  const aWords = allowed.replace(/(\r\n|\n|\r)/gm, "");
  
  const valid = aWords.includes(lc)
  return valid
}

const getWordOfTheDay = (date) => {
  const wordIndex = words.findIndex(x => x.date == date)
  if (wordIndex === -1)
    return "HAWAY"
  else 
    return words[wordIndex].word
}

export { getWordOfTheDay, validateGuess }