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

const gameController = () => {
  const playerX = createPlayer("X");
  const playerO = createPlayer("O");
  playerX.placeMarker(Gameboard.gameboard, 1, 0);
  playerX.placeMarker(Gameboard.gameboard, 0, 0);
  playerX.placeMarker(Gameboard.gameboard, 1, 2);
  playerO.placeMarker(Gameboard.gameboard, 2, 2);
  console.log(Gameboard.gameboard);
  const allEqual = (arr) => arr.every((v) => v !== "" && v === arr[0]);
  const [ row1, row2, row3 ] = Gameboard.gameboard;
  console.log({row1, row2, row3});
  const rowWin = allEqual(row1) || allEqual(row2) || allEqual(row3);
  console.log(rowWin);
  const col1 = [row1[0], row2[0], row3[0]];
  const col2 = [row1[1], row2[1], row3[1]];
  const col3 = [row1[2], row2[2], row3[2]];
  console.log({ col1, col2, col3 })
  const colWin = allEqual(col1) || allEqual(col2) || allEqual(col3);
  console.log(colWin)
}

gameController()
// create an object to control the flow of the game. it should contain methods to declare winner
