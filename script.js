// create a gameboard array having 3 arrays (rows) each containing 3 markers inside a gameboard object
// gameboard should have a method to clear all rows upon reset
const Gameboard = (() => {
  const ROWS = 3;
  const CELLS_PER_ROW = 3;
  const gameboard = Array.from(Array(ROWS), () => Array(CELLS_PER_ROW).fill(""));
  const addMarker = (player, row, column) => player.placeMarker(gameboard, row, column);
  const getBoard = () => gameboard;
  const reset = () => gameboard.forEach((row) => row.fill(""));
  return {
    getBoard,
    addMarker,
    reset,
  };
})();

// create a factory function for creating player objects having marker props and place marker methods
function createPlayer(marker) {
  marker = marker.toUpperCase();
  const placeMarker = (gameboard, row, column) => {
    if (row < 0 || row > 2) {
      throw new Error("Row index should be between 0 and 2");
    }
    if (column < 0 || column > 2) {
      throw new Error("Cell index should be between 0 and 2");
    }
    if (gameboard[row][column] !== "") {
      console.error("Cannot place marker in empty");
    }
    gameboard[row][column] = marker;
  }
  const getMarker = () => marker;
  return {
    marker,
    getMarker,
    placeMarker,
  };
}

const getUserChoice = () => "X";
// create an object to control the flow of the game. it should contain methods to declare winner
const gameController = (() => {
  // create the player objects based on the user's choice
  // once the user object is created, a com object should be automatically created having the other marker
  // assign to each player a marker
  const createPlayers = () => {
    const userChoice = getUserChoice();
    if (typeof userChoice !== "string")
      throw new Error("User choice must be a string.");
    if (userChoice !== "X" && userChoice !== "O") {
      throw new Error("Marker should be either X or O");
    }
    let user = {};
    let com = {};
    if (userChoice.trim().toUpperCase() === "X") {
      user = createPlayer("X");
      com = createPlayer("O");
    } else {
      com = createPlayer("X");
      user = createPlayer("O");
    }
    user.isUser = true;
    com.isUser = false;
    return [user, com];
  };

  const players = createPlayers();
  const playerX = players.find((player) => player.getMarker() === "X");
  const playerO = players.find((player) => player.getMarker() === "O");
  // check who's turn it is and prevent a player from playing 2 consecutive times
  let activePlayer = playerX;
  const switchPlayer = () => activePlayer = activePlayer === playerX ? playerO : playerX;
  const getActivePlayer = () => activePlayer;
  // const addMarker = (rowIndex, cellIndex) => activePlayer.placeMarker(Gameboard.getBoard(), rowIndex, cellIndex);

  const getCurrentMarker = () => activePlayer.getMarker();

  // const getCellMarker = (row, cell) => Gameboard.gameboard[row][cell];
  // console.log(getCellMarker(0, 0));
  function checkWin() {
    const allEqual = (arr) => arr.every((v) => v !== "" && v === arr[0]);
    const [ row1, row2, row3 ] = Gameboard.getBoard();
    console.log({row1, row2, row3});
    const rowWin = allEqual(row1) || allEqual(row2) || allEqual(row3);
    console.log("row win: ",rowWin);
    const col1 = [row1[0], row2[0], row3[0]];
    const col2 = [row1[1], row2[1], row3[1]];
    const col3 = [row1[2], row2[2], row3[2]];
    console.log({ col1, col2, col3 })
    const colWin = allEqual(col1) || allEqual(col2) || allEqual(col3);
    console.log("column win: ",colWin)
    const diag1 = [row1[0], row2[1], row3[2]];
    const diag2 = [row1[2], row2[1], row3[0]];
    console.log({ diag1, diag2 })
    const diagWin = allEqual(diag1) || allEqual(diag2);
    console.log("diagonal win: ",diagWin)
    const win = rowWin || colWin || diagWin;
    console.log("win: ",win);
    return win;
  }

  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const comPlay = () => {
    const gameboard = Gameboard.getBoard();
    const randomRow = getRandomIntInclusive(0, 2);
    console.log(randomRow)
    const randomColumn = getRandomIntInclusive(0, 2);
    console.log(randomColumn)
    if (gameboard[randomRow][randomColumn] !== "") {
      console.log("Cell not empty!")
      comPlay();
    }
    Gameboard.addMarker(activePlayer, randomRow, randomColumn);
  }

  const play = (row, column) => {
    console.log(getCurrentMarker());
    const gameEnded = checkWin();
    console.log("game ended: ", gameEnded);
    if (gameEnded) {
      console.table(Gameboard.getBoard());
      switchPlayer();
      const winner = getCurrentMarker();
      return `The winner is player ${winner}!`;
    }
    Gameboard.addMarker(activePlayer, row, column);
    switchPlayer();
    comPlay();
    console.table(Gameboard.getBoard());
  };
  // add logic to check for flow of the game, when it ends and who won
  // if there's a winning condition, prevent players from adding markers to the board and check which player won.
  return {
    players,
    getActivePlayer,
    play,
  };
})();
console.log(gameController.play(1, 0));
console.log(gameController.play(2, 2));
// console.log(gameController.play(0, 0));
// console.log(gameController.play(0, 2));
// console.log(gameController.play(1, 2));
// console.log(gameController.play(1, 1));
// console.log(gameController.play(0, 1));
// console.log(gameController.play(2, 0));
// console.log(gameController.play(2, 1));

// console.log({ user, com }) 
// console.log(user.getMarker())
// console.log(com.getMarker())
// console.log(gameController.firstPlayer([user, com]))
console.log(gameController.getActivePlayer())
// Create a displayController to control DOM manipulation
const displayController = (() => {
  // const markers = document.querySelector(".markers");
  // markers.addEventListener("click", (e) => {
  //   console.log(e.target.value)
  // })
})();