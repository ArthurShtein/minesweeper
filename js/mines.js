'use strict';
const MINE = '🧨';
var EMPTY = ''
var gBoard;
var gTimeInterval;
var gCurrTime;
var gIsFirstClick = true;

var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secPassed: 0,
    lifes: 3
}

function init() {
    var elLife = document.querySelector('.lifes')
    elLife.innerText = '💖💖💖'
    gGame.lifes = 3
    gIsFirstClick = true;
    reset()
    gGame.markedCount = 0
    var elFlags = document.querySelector('.flags')
    elFlags.innerText = 'Flags Marked: 0'
    gGame.isOn = false;

    gBoard = creatBoard(gLevel.SIZE)
    placeMines(gBoard)
    renderBoard(gBoard)
    setMinesNegsCount()
}

function creatBoard(SIZE) {
    var gameBoard = [];
    for (var i = 0; i < SIZE; i++) {
        gameBoard[i] = [];
        for (var j = 0; j < SIZE; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                location: { i: i, j: j }
            }
            gameBoard[i][j] = cell
        }
    }
    return gameBoard;
}

function renderBoard(board) {
    var strHtml = '';
    for (var i = 0; i < board.length; i++) {
        strHtml += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            var cellSymbol = (cell.isMine) ? MINE : cell.minesAroundCount
            var className = getClassName(i, j)
            if (!cell.isShown) {
                strHtml += `<td class="${className}" onclick="cellClicked(this,${i},${j})" oncontextmenu="cellMark(this,${i},${j});return false">${cellSymbol} </td>`
            }
        }
        strHtml += '</tr>'
    }
    var elTable = document.querySelector('.board')
    elTable.innerHTML = strHtml
}

function difficulty(elBtn) {
    if (elBtn.innerText === 'Easy') {
        gLevel.SIZE = 4
        gLevel.MINES = 2
    } else if (elBtn.innerText === 'Medium') {
        gLevel.SIZE = 8
        gLevel.MINES = 4
    } else if ((elBtn.innerText === 'Hard')) {
        gLevel.SIZE = 12
        gLevel.MINES = 6
    }
    gIsFirstClick = true;
    gGame.isOn = false;

    restart()
    init()
}

function cellClicked(elCell, i, j) {
    if (!gGame.isOn && gIsFirstClick) {
        gIsFirstClick = false;
        gGame.isOn = true;
        timer()
    }
    if (!gGame.isOn) return;

    var cell = gBoard[i][j]
    if (cell.isMarked) return;
    if (cell.isShown) return;

    cell.isShown = true;
    renderCell(elCell, cell)

    if (cell.minesAroundCount === 0) {
        showNegs(i, j)
    }
    if (cell.isMine && !gGame.lifes) {
        gameOver()
    } else if (cell.isMine && gGame.lifes) {
        gGame.lifes--;
        var className = getClassName(i, j)
        var elCell = document.querySelector(`.${className}`)
        elCell.style.backgroundColor = 'lightpink'
        if (gGame.lifes === 2) {
            var elLife = document.querySelector('.lifes')
            elLife.innerText = '💖💖'
        }
        if (gGame.lifes === 1) {
            var elLife = document.querySelector('.lifes')
            elLife.innerText = '💖'
        }
        if (!gGame.lifes) {
            var elLife = document.querySelector('.lifes')
            elLife.innerText = ''
            gameOver()
        }
        console.log(gGame.lifes)

    }
    if (isVictory()) {
    }
}

function showAllMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isMine) {
                //update model
                gBoard[i][j].isShown = true;
                //update dom
                var className = getClassName(i, j)
                var elCell = document.querySelector(`.${className}`)
                elCell.style.backgroundColor = 'lightpink'
                renderCell(elCell, gBoard[i][j])
            }
        }
    }
}

function cellMark(elCell, i, j) {
    if (!gGame.isOn && gIsFirstClick) {
        gIsFirstClick = false;
        gGame.isOn = true;
        timer()
    }

    if (!gGame.isOn) return;

    var elFlags = document.querySelector('.flags')
    var cell = gBoard[i][j]
    if (cell.isShown) return;

    if (cell.isMarked) {
        cell.isMarked = !cell.isMarked;
        gGame.markedCount--;
        renderCell(elCell, cell)
        elCell.style.backgroundColor = 'white'
        elFlags.innerText = 'Flags Marked: ' + gGame.markedCount;
        return;
    }

    cell.isMarked = !cell.isMarked;
    var className = getClassName(i, j)
    var elCell = document.querySelector(`.${className}`)
    elCell.innerText = '📍'
    elCell.style.backgroundColor = 'orange'
    gGame.markedCount++;

    elFlags.innerText = 'Flags Marked: ' + gGame.markedCount;

    if (isVictory())
        return false;
}

function gameOver() {
    clearInterval(gTimeInterval)
    showAllMines()
    gGame.isOn = false;
    var elBtn = document.querySelector('.reset')
    var elMsg = document.querySelector('.msg')

    elBtn.innerHTML = '💀'
    elMsg.innerHTML = 'GAME OVER'
}

function isVictory() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var cell = gBoard[i][j]
            if (cell.isMine && !cell.isMarked && !cell.isShown) return false;
            if (!cell.isShown && !cell.isMine) return false;
        }
    }
    var elBtn = document.querySelector('.reset')
    var elMsg = document.querySelector('.msg')

    elBtn.innerHTML = '😎'
    elMsg.innerHTML = 'Congratulations! You won! '
    gGame.isOn = false;
    clearInterval(gTimeInterval)
    return true;
}

function setMinesNegsCount() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j]
            //model update
            cell.minesAroundCount = countNegs(i, j)
            //update dom
            var className = getClassName(i, j)
            var elCell = document.querySelector(`.${className}`)
            renderCell(elCell, cell)
        }
    }
}

function countNegs(rowIdx, colIdx) {
    var mineCount = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue;
            if (i === rowIdx && j === colIdx) continue
            var cell = gBoard[i][j];
            if (cell.isMine) mineCount++
        }
    }
    return mineCount
}

function getClassName(i, j) {
    return `cell-${i}-${j}`
}

function renderCell(elCell, cell) {
    var strHtml = ''
    if (cell.isShown) {
        if (cell.isMine) {
            strHtml = MINE
        } else if (cell.minesAroundCount === 0) {
            strHtml = ' '
            elCell.style.backgroundColor = 'lightgrey'
        } else if (cell.minesAroundCount) {
            strHtml = cell.minesAroundCount
        }
    }
    elCell.innerHTML = strHtml
}

function restart(elBtn) {
    var elMsg = document.querySelector('.msg')
    var elBtn = document.querySelector('.reset')
    var elFlags = document.querySelector('.flags')

    elMsg.innerHTML = ''
    elBtn.innerHTML = '😃'
    elFlags.innerText = 'Flags Marked: 0'
    init()
}


function placeMines(gBoard) {
    for (var i = 0; i < gLevel.MINES; i++) {
        var row = getRandomInt(0, gLevel.SIZE)
        var col = getRandomInt(0, gLevel.SIZE)
        gBoard[row][col].isMine = true;
    }
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}


function showNegs(rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue;
            if (i === rowIdx && j === colIdx) continue

            var cell = gBoard[i][j];
            if (cell.isMarked || cell.cellSymbol === MINE) continue;
            if (!cell.isShown && !cell.isMine) cell.isShown = true;
            var elCell = document.querySelector('.' + getClassName(i, j))
            renderCell(elCell, cell)
        }
    }
}

function tick(start) {
    var now = Date.now()
    gCurrTime = Math.floor((now - start) / 1000);
    var elTime = document.querySelector('.timer h4')
    elTime.innerText = 'Timer: ' + gCurrTime
}

function timer() {
    var start = Date.now()
    gTimeInterval = setInterval(function () {
        tick(start)
    }, 1000)
}

function reset() {
    var elTime = document.querySelector('.timer h4')
    elTime.innerText = 'Time: 0'
    clearInterval(gTimeInterval)
}