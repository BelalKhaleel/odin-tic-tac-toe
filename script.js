const Gameboard = (() => {
  const ROWS = 3;
  const CELLS_PER_ROW = 3;
  const gameboard = Array.from(Array(ROWS), () =>
    Array(CELLS_PER_ROW).fill(""),
  );
  const addMarker = (player, row, column) =>
    player.placeMarker(gameboard, row, column);
  const getBoard = () => gameboard;
  const reset = () => gameboard.forEach((row) => row.fill(""));
  return {
    getBoard,
    addMarker,
    reset,
  };
})();

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
      console.error("Cannot place marker in non-empty cell");
      return;
    }
    gameboard[row][column] = marker;
  };
  const getMarker = () => marker;

  return {
    getMarker,
    placeMarker,
  };
}

const gameController = (() => {
  const createPlayers = (userChoice) => {
    if (!userChoice) return;
    console.log(userChoice);
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
    return [user, com];
  };

  function allEqual(arr) {
    return arr.every((v) => v !== "" && v === arr[0]);
  }

  let winningMarker = "";

  function checkWin() {
    const [row1, row2, row3] = Gameboard.getBoard();
    console.log({ row1, row2, row3 });
    const col1 = [row1[0], row2[0], row3[0]];
    const col2 = [row1[1], row2[1], row3[1]];
    const col3 = [row1[2], row2[2], row3[2]];
    console.log({ col1, col2, col3 });
    const diag1 = [row1[0], row2[1], row3[2]];
    const diag2 = [row1[2], row2[1], row3[0]];
    console.log({ diag1, diag2 });

    const rowWin = allEqual(row1) || allEqual(row2) || allEqual(row3);
    console.log("row win: ", rowWin);
    const colWin = allEqual(col1) || allEqual(col2) || allEqual(col3);
    console.log("column win: ", colWin);
    const diagWin = allEqual(diag1) || allEqual(diag2);
    console.log("diagonal win: ", diagWin);
    const haveWinner = rowWin || colWin || diagWin;
    if (allEqual(row1)) {
      winningMarker = row1[0];
    } else if (allEqual(row2)) {
      winningMarker = row2[0];
    } else if (allEqual(row3)) {
      winningMarker = row3[0];
    } else if (allEqual(col1)) {
      winningMarker = col1[0];
    } else if (allEqual(col2)) {
      winningMarker = col2[0];
    } else if (allEqual(col3)) {
      winningMarker = col3[0];
    } else if (allEqual(diag1)) {
      winningMarker = diag1[0];
    } else if (allEqual(diag2)) {
      winningMarker = diag2[0];
    }

    console.log("win: ", haveWinner);
    return haveWinner;
  }

  const comPlay = (com) => {
    const availableRows = Gameboard.getBoard().reduce(
      (accumulator, row, index) => {
        if (row.includes("")) accumulator.push(index);
        return accumulator;
      },
      [],
    );

    console.log("available rows: ", availableRows);
    const randomRow =
      availableRows[Math.floor(Math.random() * availableRows.length)];
    const availableColumns = Gameboard.getBoard()[randomRow].reduce(
      (accumulator, column, index) => {
        if (column === "") accumulator.push(index);
        return accumulator;
      },
      [],
    );

    const randomColumn =
      availableColumns[Math.floor(Math.random() * availableColumns.length)];
    Gameboard.addMarker(com, randomRow, randomColumn);
    gameEnded = checkWin();
    console.log("game ended: ", gameEnded);
    if (gameEnded) {
      console.table(gameboard);
      return;
    }
  };

  const play = (user, row, column) => {
    if (Gameboard.getBoard()[row][column] !== "") return;
    Gameboard.addMarker(user, row, column);

    gameEnded = checkWin();
    if (gameEnded) {
      console.table(Gameboard.getBoard());
      return;
    }
  };

  const getWinner = () => winningMarker;

  const resetGame = () => {
    Gameboard.reset();
    winningMarker = "";
  };

  return {
    createPlayers,
    comPlay,
    play,
    getWinner,
    resetGame,
  };
})();

const displayController = (() => {
  const markers = document.querySelector(".markers");
  const startResetBtn = document.querySelector(".start-reset-btn");
  const gameboardDiv = document.querySelector(".gameboard");
  const boardCells = document.querySelectorAll(".gameboard button");
  const result = document.querySelector(".result");
  const errorMessage = document.querySelector(".error-message");

  let user = (com = {});

  const updateBoardDisplay = () => {
    const cellsValues = Gameboard.getBoard().flat();
    boardCells.forEach((cell) => (cell.textContent = cellsValues.shift()));
  };

  const handleMarkersClick = (e) => {
    const marker = e.target.value;
    [user, com] = gameController.createPlayers(marker);
    if (com.getMarker() === "X") {
      gameController.comPlay(com);
      setTimeout(() => updateBoardDisplay(), 500);
    }
    errorMessage.textContent = "";
  };

  const startGame = () => {
    markers.addEventListener("click", handleMarkersClick, { once: true });
  };

  const updateBoard = () => {
    gameboardDiv.addEventListener("click", (e) => {
      const cell = e.target;
      const row = Number(cell.dataset.row);
      const column = Number(cell.dataset.column);
      console.log({ user });
      console.log({ com });
      if (Object.keys(user).length === 0 || Object.keys(com).length === 0) {
        console.log("Please select a marker");
        errorMessage.textContent = "*Please select a marker!";
        return;
      }
      gameController.play(user, row, column);
      updateBoardDisplay();
      const winner = gameController.getWinner();
      if (winner) {
        result.textContent = `The winner is ${winner}!`;
        return;
      }
      gameController.comPlay(com);
      gameboardDiv.style.pointerEvents = "none";
      setTimeout(() => {
        updateBoardDisplay();
        gameboardDiv.style.pointerEvents = "";
        const winner = gameController.getWinner();
        if (winner) {
          result.textContent = `The winner is ${winner}!`;
          return;
        }
      }, 500);
    });
  };

  const resetGame = () => {
    startResetBtn.addEventListener("click", () => {
      gameController.resetGame();
      updateBoardDisplay();
      user = com = {};
      markers.addEventListener("click", handleMarkersClick, { once: true });
      result.textContent = "";
      errorMessage.textContent = "";
    });
  };

  return {
    startGame,
    updateBoard,
    resetGame,
  };
})();

displayController.startGame();
displayController.resetGame();
displayController.updateBoard();
