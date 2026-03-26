// create a gameboard array having 3 arrays (rows) each containing 3 markers inside a gameboard object
// gameboard should have a method to clear all rows upon reset
const Gameboard = (() => {
  const rows = 3;
  const cells = 3;
  const gameboard = Array.from(Array(rows), () => Array(cells).fill(""));
  const reset = () => gameboard.forEach(row => row.fill(""));
  return {
    gameboard,
    reset
  }
})();

// create a factory function for creating player objects having marker props and place marker methods

// create an object to control the flow of the game. it should contain methods to declare winner