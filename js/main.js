'use strict'


const MINE = '💣'
const MARK = '🚩'
const EMPTY = ''
var gBoard
var gStartTime
var gTimerInterval
// var gMinesCount = 0



const gGame = {
    isOn: false,
    shownCount: 0,
    secsPassed: 0,
    flagCount: 0
}

var gLevel = {
    size: 4,
    mines: 2
}

function onInitGame() {
    // gGame.isOn = false
    // clearInterval(gTimerInterval)
    startTimer()
    gBoard = buildBoard(gLevel.size)
    locateMines()
    negsCount(gBoard)
    renderBoard(gBoard)
    console.log('gLevel.size**2 = ', (gLevel.size ** 2) - gLevel.mines)
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
            }
            else {
                currCell = MINE
                className = `cell mine cell-${i}-${j}`
                // gMinesCount++
            }
            strHTML += `<td class="${className}" onclick="onCellClicked(this,${i},${j})" oncontextmenu="plantFlag(this,${i},${j})">${currCell}</td>`
        }
        strHTML += '</tr>'
    }

    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}


// ממקם מוקשים
function locateMines() {
    for (var i = 0; i < gLevel.mines; i++) {
        gBoard[getRandomInt(0, gBoard.length - 1)][getRandomInt(0, gBoard.length - 1)].isMine = true
    }
}


function onCellClicked(elCell, cellI, cellJ) {
    var currCell = gBoard[cellI][cellJ]
    elCell.classList.add('shown')
    currCell.isShown = true

    if (!currCell.isMine) {
        gGame.shownCount++
        console.log('gGame.shownCount = ', gGame.shownCount)
    } else {
        gameOver(currCell)
    }

    if (gGame.isOn) return
    gGame.isOn = true
    startTimer()
}



function plantFlag(elCell, cellI, cellJ) {
    if (gGame.isOn)
        var location = { i: cellI, j: cellJ }
    var currCell = gBoard[cellI][cellJ]

    if (!currCell.isMarked) {
        currCell.isMarked = true
        elCell.style.color = 'black'
        renderCell(location, MARK)
        gGame.flagCount++
    } else {
        gGame.flagCount--
        renderCell(location, '')
        currCell.isMarked = false
    }
}


function gameOver(currCell) {
    if (currCell.isMine) {
        clearInterval(gTimerInterval)
    }
    if (gGame.flagCount === gLevel.mines && gGame.shownCount === (gLevel.size ** 2) - gLevel.mines) {
        clearInterval(gTimerInterval)
    }

}



function startTimer() {
    if (gGame.isOn) {
        gStartTime = Date.now()
        gTimerInterval = setInterval(() => {
            const seconds = (Date.now() - gStartTime) / 1000
            var elH2 = document.querySelector('.timer')
            elH2.innerText = seconds.toFixed(2) + '⏳'
        }, 10);
    }
}


