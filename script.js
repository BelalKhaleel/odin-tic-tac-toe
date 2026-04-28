const Gameboard = (() => {
  const ROWS = 3;
  const CELLS_PER_ROW = 3;
  const gameboard = Array.from(Array(ROWS), () =>
    Array(CELLS_PER_ROW).fill(""),
  );
  const addMarker = (marker, row, column) => {
    if (row < 0 || row > 2) {
      throw new Error("Row index should be between 0 and 2");
    }
    if (column < 0 || column > 2) {
      throw new Error("Cell index should be between 0 and 2");
    }
    if (gameboard[row][column] !== "") {
      return;
    }
    gameboard[row][column] = marker;
  };
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
  const getMarker = () => marker;

  return {
    getMarker,
  };
}

const gameController = (() => {
  const createPlayers = (userChoice) => {
    if (!userChoice) return;
    if (typeof userChoice !== "string") {
      throw new Error("User choice must be a string.");
    }
    userChoice = userChoice.trim().toUpperCase();
    if (userChoice !== "X" && userChoice !== "O") {
      throw new Error("Marker should be either X or O");
    }
    let user = {};
    let com = {};
    if (userChoice === "X") {
      user = createPlayer("X");
      com = createPlayer("O");
    } else {
      com = createPlayer("X");
      user = createPlayer("O");
    }
    return [user, com];
  };

  const allEqual = (arr) => arr.every((v) => v !== "" && v === arr[0]);

  let winningMarker = "";

  const checkWin = () => {
    const [row1, row2, row3] = Gameboard.getBoard();

    const col1 = [row1[0], row2[0], row3[0]];
    const col2 = [row1[1], row2[1], row3[1]];
    const col3 = [row1[2], row2[2], row3[2]];
    const diag1 = [row1[0], row2[1], row3[2]];
    const diag2 = [row1[2], row2[1], row3[0]];

    const row1Win = allEqual(row1);
    const row2Win = allEqual(row2);
    const row3Win = allEqual(row3);
    const col1Win = allEqual(col1);
    const col2Win = allEqual(col2);
    const col3Win = allEqual(col3);
    const diag1Win = allEqual(diag1);
    const diag2Win = allEqual(diag2);

    if (row1Win) {
      winningMarker = row1[0];
    } else if (row2Win) {
      winningMarker = row2[0];
    } else if (row3Win) {
      winningMarker = row3[0];
    } else if (col1Win) {
      winningMarker = col1[0];
    } else if (col2Win) {
      winningMarker = col2[0];
    } else if (col3Win) {
      winningMarker = col3[0];
    } else if (diag1Win) {
      winningMarker = diag1[0];
    } else if (diag2Win) {
      winningMarker = diag2[0];
    }
  };

  const checkDraw = () =>
    Gameboard.getBoard()
      .flat()
      .every((cell) => cell !== "");

  const comPlay = (com) => {
    const availableRows = Gameboard.getBoard().reduce(
      (accumulator, row, index) => {
        if (row.includes("")) accumulator.push(index);
        return accumulator;
      },
      [],
    );

    if (availableRows.length === 0) return;
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
    const marker = com.getMarker();
    Gameboard.addMarker(marker, randomRow, randomColumn);
    checkWin();
  };

  const play = (user, row, column) => {
    if (Gameboard.getBoard()[row][column] !== "") return false;
    const marker = user.getMarker();
    Gameboard.addMarker(marker, row, column);
    checkWin();
    return true;
  };

  const getWinner = () => winningMarker;

  const getGameStatus = () => {
    if (winningMarker) return "win";
    if (checkDraw()) return "draw";
    return null;
  }

  const resetGame = () => {
    Gameboard.reset();
    winningMarker = "";
  };

  return {
    createPlayers,
    comPlay,
    play,
    getGameStatus,
    getWinner,
    resetGame,
  };
})();

const displayController = (() => {
  const markers = document.querySelector(".markers");
  const resetBtn = document.querySelector(".reset-btn");
  const gameboardDiv = document.querySelector(".gameboard");
  const boardCells = document.querySelectorAll(".gameboard button");
  const result = document.querySelector(".result");
  const errorMessage = document.querySelector(".error-message");
  const markerButtons = document.querySelectorAll(".marker");

  let user = {};
  let com = {};

  const updateBoardDisplay = () => {
    const cellsValues = Gameboard.getBoard().flat();
    boardCells.forEach((cell) => (cell.textContent = cellsValues.shift()));
  };

  const handleMarkersClick = (e) => {
    const button = e.target.closest(".marker");
    if (!button) return;
    const marker = button.value;
    [user, com] = gameController.createPlayers(marker);
    if (com.getMarker() === "X") {
      gameController.comPlay(com);
      setTimeout(() => updateBoardDisplay(), 500);
    }
    button.classList.add("active-btn");
    errorMessage.textContent = "";
  };

  const startGame = () => {
    markers.addEventListener("click", handleMarkersClick, { once: true });
  };

  const endGame = (message) => {
    result.textContent = message;
    gameboardDiv.style.pointerEvents = "none";
  };
  
  const checkEndGame = () => {
    // gameController.checkWin();
    const status = gameController.getGameStatus();
    const winner = gameController.getWinner();
    switch(status) {
      case "win":
        endGame(`The winner is ${winner}!`);
        return true;
      case "draw":
        endGame(`It's a draw!`);
        return true;
      default:
        return false;
    }
  }

  const updateBoard = () => {
    gameboardDiv.addEventListener("click", (e) => {
      const cell = e.target.closest("button[data-row][data-column]");
      if (!cell) return;
      const row = Number(cell.dataset.row);
      const column = Number(cell.dataset.column);
      if (Object.keys(user).length === 0 || Object.keys(com).length === 0) {
        errorMessage.textContent = "*Please select a marker!";
        return;
      }
      const placed = gameController.play(user, row, column);
      if (!placed) return;
      updateBoardDisplay();
      const gameOver = checkEndGame();
      if (gameOver) return;
      gameController.comPlay(com);
      gameboardDiv.style.pointerEvents = "none";
      setTimeout(() => {
        updateBoardDisplay();
        gameboardDiv.style.pointerEvents = "";
        checkEndGame();
      }, 500);
    });
  };

  const resetGame = () => {
    resetBtn.addEventListener("click", () => {
      markerButtons.forEach(btn => btn.classList.remove("active-btn"));
      gameController.resetGame();
      updateBoardDisplay();
      user = {};
      com = {};
      markers.addEventListener("click", handleMarkersClick, { once: true });
      result.textContent = "";
      errorMessage.textContent = "";
      gameboardDiv.style.pointerEvents = "";
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
