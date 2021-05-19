function printMat(mat, selector) {
  var strHTML = '<table border="0"><tbody>';
  for (var i = 0; i < mat.length; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < mat[0].length; j++) {
      var cell = mat[i][j];
      var className = 'cell cell' + i + '-' + j;
      strHTML += '<td class="' + className + '"> ' + cell + ' </td>'
    }
    strHTML += '</tr>'
  }
  strHTML += '</tbody></table>';
  var elContainer = document.querySelector(selector);
  elContainer.innerHTML = strHTML;
}

// location such as: {i: 2, j: 7}
function renderCell(location, value) {
  // Select the elCell and set the value
  var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
  elCell.innerHTML = value;
}

function getRandomIntInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


function getEmptyCells(board) {
  var emptyCells = []
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      if (board[i][j] === null) {
        var cell = { i: i, j: j }
        emptyCells.push(cell);
      }
    }
  }
  return emptyCells;
}

function drawNum(emptyCells) {
  return emptyCells.pop();
}

function shuffle(items) {
  var randIdx, keep, i;
  for (i = items.length - 1; i > 0; i--) {
    randIdx = getRandomInt(0, items.length - 1);
    keep = items[i];
    items[i] = items[randIdx];
    items[randIdx] = keep;
  }
  return items;
}


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function creatBoard(gSize = 4) {
  var gameBoard = [];
  for (var i = 0; i < gSize; i++) {
    gameBoard[i] = [];
    for (var j = 0; j < gSize; j++) {
      gameBoard[i][j] = randomNum(gNums);
    }
  }
  return gameBoard;
}

function renderBoard(board) {
  var strHtml = '';
  for (var i = 0; i < board.length; i++) {
    strHtml += '<tr>'
    for (var j = 0; j < board[0].length; j++) {
      strHtml += `<td onclick="cellClicked(this ,${board[i][j]})">${board[i][j]}</td>`
    }
    strHtml += '</tr>'
  }
  var elTable = document.querySelector('.board')
  elTable.innerHTML = strHtml
}
