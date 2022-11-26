'use strict'


const MINE = '💣'
const MARK = '🚩'
const EMPTY = ''
const HINT = '💡'
const NORMAL = '😄'
const LOSE = '🤯'
const WIN = '😎'

var elSmiley = document.querySelector('.smiley')


var gBoard
var gStartTime
var gTimerInterval
var gMinesInterval
var gGame
var gIsHint = false


var gLevel = {
    size: 4,
    mines: 2
}

function onInitGame() {
    gBoard = buildBoard(gLevel.size)
    renderBoard(gBoard)
    resetGame()
}

function resetGame() {
    gGame = {
        isOn: false,
        isFirstClick: true,
        shownCount: 0,
        secsPassed: 0,
        flagCount: 0,
        lives: 3,
        hints: 3
    }

    document.querySelector('.lives').innerText = '🤍 🤍 🤍'
    document.querySelector('.hint').innerText = '💡💡💡'
    document.querySelector('.timer').innerText = '000⏳'
    elSmiley.innerText = NORMAL
    onToggleModal()
    clearInterval(gTimerInterval)
}

function onChangeLevel(size, mines) {
    gLevel.size = size
    gLevel.mines = mines
    onInitGame()
}



function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            var className = `cell cell-${i}-${j}`
            if (!currCell.isMine) {
                currCell = currCell.minesAroundCount
            } else {
                currCell = MINE
                // gMinesCount++
            }
            strHTML += `<td class="${className}" onclick="onCellClicked(this,${i},${j})" oncontextmenu="plantFlag(this,${i},${j})">${currCell}</td>`
        }
        strHTML += '</tr>'
    }

    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}


function onCellClicked(elCell, cellI, cellJ) {
    var currCell = gBoard[cellI][cellJ]
    if (currCell.isMarked) return
    //general
    currCell.isShown = true

    // first click
    if (gGame.isFirstClick) {
        gGame.shownCount++
        locateMines(cellI, cellJ)
        negsCount(gBoard)
        gGame.isFirstClick = false
        gGame.isOn = true
        startTimer()
    }

    // if hint is clicked
    if (gIsHint) {
        expandHint(gBoard, cellI, cellJ)
    } 


    // if is mine
    if (currCell.isMine) {
        onMineClick(elCell)
        if (checkGameOver()) lose()
    }

    //if is NOT mine and NOT first click
    if (!currCell.isMine) {
        elCell.classList.add('shown')
        elCell.style.color = '#c54914'
        gGame.shownCount++
        checkNegs(elCell, cellI, cellJ)
        elCell.innerText = currCell.minesAroundCount
    }
}


function onMineClick(elCell) {
    elCell.innerText = MINE
    gGame.lives--
    var lives = document.querySelector('.lives').innerText
    lives = lives.slice(2)
    document.querySelector('.lives').innerText = lives
    elCell.classList.add('shown')
}



function plantFlag(elCell, cellI, cellJ) {
    var currCell = gBoard[cellI][cellJ]
    console.log('currCell = ', currCell)
    if (currCell.isShown) return

    if (gGame.isOn) {

        if (!currCell.isMarked) {
            elCell.style.color = 'rgb(197, 73, 20)'
            elCell.innerText = MARK
            gGame.flagCount++
        }

        if (currCell.isMarked) {
            elCell.innerText = ''
            elCell.style.color = 'transparent'
            gGame.flagCount--
        }
        currCell.isMarked = !currCell.isMarked
    }
    if (checkGameOver()) win()
}



function checkGameOver() {
    // if all marked flags = all mines && all shown cells >= cells that are not mines
    if (gGame.flagCount === gLevel.mines && gGame.shownCount === gLevel.size ** 2 - gLevel.mines) return true
    if (gGame.shownCount >= (gLevel.size ** 2) - gLevel.mines) return true
    if (gGame.lives === 0) return true
    if (gGame.shownCount >= gLevel.size ** 2) return true
    if (gGame.flagCount !== gLevel.mines && (gGame.shownCount - gGame.flagCount === gLevel.size ** 2 - gLevel.mines)) return true

    return false
}




function showMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isMine) {
                var elCell = document.querySelector(`.cell-${i}-${j}`)
                elCell.classList.add('shown')
                elCell.innerText = MINE
            }
        }
    }
}



function locateMines(cellI, cellJ) {
    var cells = getEmptyCells(gBoard)
    for (var i = 0; i < gLevel.mines; i++) {
        var emptyCell = drawRandomCell(cells)
        if (emptyCell.i === cellI && emptyCell.j === cellJ || gBoard[emptyCell.i][emptyCell.j.isMine]) {
            emptyCell = drawRandomCell(cells)
        } else {
            gBoard[emptyCell.i][emptyCell.j].isMine = true
        }
    }
}


function checkNegs(elCell, i, j) {
    if (gBoard[i][j].minesAroundCount === 0 && !gBoard[i][j].isMine) {
        elCell.innerText = EMPTY
        expandShown(gBoard, i, j)
    }
}


function onHint() {
    gIsHint = true
    var elHint = document.querySelector(`.hint`).innerText
    elHint = elHint.slice(2)
    document.querySelector('.hint').innerText = elHint

}


