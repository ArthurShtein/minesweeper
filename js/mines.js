'use strict';
const MINE = '🧨';
var gSize = 4;

var gBoard;

var gLevel = {
    SIZE: 4,
    MINES: 2
}



function init() {
    gBoard = creatBoard(gSize)
    renderBoard(gBoard)
}


function creatBoard(gSize) {
    var gameBoard = [];
    for (var i = 0; i < gSize; i++) {
        gameBoard[i] = [];
        for (var j = 0; j < gSize; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: true,
                isMine: false,
                isMarked: false,
                location: { i: i, j: j }
            }
            gameBoard[i][j] = cell
        }
    }

    gameBoard[1][1].isMine = true;
    gameBoard[3][3].isMine = true;

    return gameBoard;
}

function renderBoard(board) {
    var strHtml = '';
    for (var i = 0; i < board.length; i++) {
        strHtml += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            var cellSymbol = (cell.isMine)? MINE : cell.minesAroundCount
            var className = getClassName(i, j)
            if (!cell.isShown) {
                strHtml += `<td class="${className} unchecked" onclick="cellClicked(this,${i},${j})"> </td>`

            } else {

                strHtml += `<td class="${className} unchecked" onclick="cellClicked(this,${i},${j})"> ${cellSymbol} </td>`
            }
        }
        strHtml += '</tr>'
    }
    var elTable = document.querySelector('.board')
    elTable.innerHTML = strHtml
}


function difficulty(elBtn) {
    if (elBtn.innerText === 'Easy') {
        gSize = 4
    } else if (elBtn.innerText === 'Medium') {
        gSize = 8
    } else if ((elBtn.innerText === 'Hard')) {
        gSize = 12
    }
    init()
}



function renderCell(location, value) {
    // Select the elCell and set the value
    var elCell = document.querySelector(`.cell cell-${location.i}-${location.j}`);
    elCell.innerText = value;
}


function cellClicked(elCell, i, j) {
    console.log(elCell)
    console.log(i, j)
    var cell = gBoard[i][j]
    if (cell.isMine) {
        alert('game over')
        // gameover() // TODO
    }
    if (cell.isShown === false) {
        cell.isShown = true;
        if (cell.isShown) {
            cell.minesAroundCount

        }
    }

    // var bombsCount = minesAround(gBoard, i, j)
    // elCell.innerText = bombsCount
    //     console.log(cell.isShown)
    //     console.log(cell.isMine)
}


function getClassName(i, j) {
    return `cell cell-${i}-${j}`
}


// function getCellCoord() {
//     var cellClass =
// }


// TODO
function gameOver() {
}

function setMinesNegsCount() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j]
            cell.minesAroundCount = countNegs(i, j)
            var className = getClassName(i, j)
            var elCell = document.querySelector(`.${className}`)
            renderCell(elCell, cell)
        }
    }
}

function countNegs(rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue;
            if (i === rowIdx && j === colIdx) continue
            var cell = gBoard[i][j];
            if (cell.isMine) cell.minesAroundCount++;
        }
    }
}

// function renderCell(elCell, cell) {
//     var strHtml = ''
//     if (cell.isShown) {
//         if (cell.isMine) {
//             strHtml = MINE
//         } else if (!cell.minesAround) {
//             strHtml = ''
//         } else if (cell.minesAroundCount) {
//             strHtml = cell.minesAround
//         }
//     }
//     elCell.innerHTML = strHtml
// }

function getClassName(i, j) {
    return `cell-${i}-${j}`
}

function renderCell(elCell, cell) {
    var strHtml = ''
    if (cell.isShown) {
        if (cell.isMine) {
            strHtml = MINE
        } else if (!cell.minesAround) {
            strHtml = EMPTY
            elCell.style.backgroundColor = '#888'
        } else if (cell.minesAround) {
            strHtml = cell.minesAround
        }
    }
    elCell.innerHTML = strHtml
}

function restart(elBtn) {
    init()
}
