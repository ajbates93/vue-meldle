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
];

const getWordOfTheDay = (date) => {
  const wordIndex = words.findIndex(x => x.date == date)
  if (wordIndex === -1)
    return "HAWAY"
  else 
    return words[wordIndex].word
}

export { getWordOfTheDay }