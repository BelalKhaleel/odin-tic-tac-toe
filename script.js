// create a gameboard array having 3 arrays (rows) each containing 3 markers inside a gameboard object
// gameboard should have a method to clear all rows upon reset
const Gameboard = (() => {
  const ROWS = 3;
  const CELLS_PER_ROW = 3;
  const gameboard = Array.from(Array(ROWS), () => Array(CELLS_PER_ROW).fill(""));
  const reset = () => gameboard.forEach((row) => row.fill(""));
  return {
    gameboard,
    reset,
  };
})();

// create a factory function for creating player objects having marker props and place marker methods
function createPlayer(marker) {
  marker = marker.toUpperCase();
  if (typeof marker !== "string" || (marker !== "X" && marker !== "O")) {
    throw new Error("Marker should be either X or O");
  }
  const placeMarker = (gameboard, rowIndex, cellIndex) => {
    if (rowIndex < 0 || rowIndex > 2) {
      throw new Error("Row index should be between 0 and 2");
    }
    if (cellIndex < 0 || cellIndex > 2) {
      throw new Error("Cell index should be between 0 and 2");
    }
    if (gameboard[rowIndex][cellIndex] !== "")
      throw new Error("Cannot place marker in an unempty cell");
    gameboard[rowIndex][cellIndex] = marker;
  }
  return {
    placeMarker,
  };
}

const playerX = createPlayer("X");
playerX.placeMarker(Gameboard.gameboard, 1, 2);
console.log(Gameboard.gameboard);
const playerO = createPlayer("O");
playerO.placeMarker(Gameboard.gameboard, 2, 2);
console.log(Gameboard.gameboard);
// create an object to control the flow of the game. it should contain methods to declare winner
