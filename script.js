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
    if (gameboard[rowIndex][cellIndex] !== "") {
      throw new Error("Cannot place marker in an unempty cell");
    }
    gameboard[rowIndex][cellIndex] = marker;
  }
  const getMarker = () => marker;
  return {
    getMarker,
    placeMarker,
  };
}

// create an object to control the flow of the game. it should contain methods to declare winner
const gameController = (() => {
  // assign to each player a marker
  const playerX = createPlayer("X");
  const playerO = createPlayer("O");
  // check who's turn it is and prevent a player from playing 2 consecutive times
  let playerXTurn = true;
  const getCurrentPlayer = () => playerXTurn ? playerX : playerO;
  const switchTurns = () => playerXTurn = !playerXTurn;
  // console.log("current player: ", getCurrentPlayer().marker)
  // switchTurns();
  // console.log("current player: ", getCurrentPlayer().marker)
  // switchTurns();
  // console.log("current player: ", getCurrentPlayer().marker)
  // switchTurns();
  // console.log("current player: ", getCurrentPlayer().marker)
  const addMarker = (rowIndex, cellIndex) => {
    const currentPlayer = getCurrentPlayer();
    currentPlayer.placeMarker(Gameboard.gameboard, rowIndex, cellIndex);
    switchTurns();
  }
  const getCurrentMarker = () => {
    const currentPlayer = getCurrentPlayer();
    return currentPlayer.getMarker();
  }
  console.log(getCurrentMarker());
  addMarker(1, 0);
  console.log(getCurrentMarker());
  addMarker(2, 2);
  console.log(getCurrentMarker());
  addMarker(0, 0);
  console.log(getCurrentMarker());
  addMarker(0, 2);
  console.log(getCurrentMarker());
  addMarker(1, 2);
  console.log(getCurrentMarker());
  addMarker(1, 1);
  console.log(getCurrentMarker());
  console.log(Gameboard.gameboard);
  // const getCellMarker = (row, cell) => Gameboard.gameboard[row][cell];
  // console.log(getCellMarker(0, 0));
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
  const diag1 = [row1[0], row2[1], row3[2]];
  const diag2 = [row1[2], row2[1], row3[0]];
  console.log({ diag1, diag2 })
  const diagWin = allEqual(diag1) || allEqual(diag2);
  console.log(diagWin)
  const win = rowWin || colWin || diagWin;
  const checkWin = () => win;
  console.log(checkWin());
  // add logic to check for flow of the game, when it ends and who won
  // if there's a winning condition, prevent players from adding markers to the board and check which player won.
  return 
})();

// Create a displayController to control DOM manipulation