'use strict'


const MINE = '💣'
const MARK = '🚩'
const EMPTY = ''
const NORMAL = '😄'
const LOSE = '🤯'
const WIN = '😎'

var elSmiley = document.querySelector('.smiley')


var gBoard
var gStartTime
var gTimerInterval
var gGame
var gHint = false

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
        lives: 3
    }
    var lives = document.querySelector('.lives').innerText
    document.querySelector('.lives').innerText = lives

    clearInterval(gTimerInterval)
    document.querySelector('.timer').innerText = '000⏳'
    // var elSmiley = document.querySelector('.smiley')
    elSmiley.innerText = NORMAL
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
                // gMinesCount++
            }
            strHTML += `<td class="${className}" onclick="onCellClicked(this,${i},${j})" oncontextmenu="plantFlag(this,${i},${j})">${currCell}</td>`
        }
        strHTML += '</tr>'
    }

    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}


function revealAllMines(){
    for (var i = 0; i < gLevel.size; i++) {
       for (var j = 0; j < gLevel.size; j++) {
          if (gBoard[i][j].isMine) {
         gBoard[i][j].isShown = true
          var elMine = document.querySelector(`cell-${gBoard[i][j].i}-${gBoard[i][j].j}`)
          console.log('elMine = ', elMine)
          }
       }
    }
 }


function onCellClicked(elCell, cellI, cellJ) {
    var currCell = gBoard[cellI][cellJ]
    // console.log('gGame.shownCount = ', gGame.shownCount)
    // console.log('gLevel.mines = ', gLevel.mines)

    //general
    currCell.isShown = true
    elCell.classList.add('shown')
    gGame.shownCount++
    
    // first click
    if (gGame.isFirstClick) {
        if (!gTimerInterval) startTimer()
        gGame.shownCount++
        locateMines(currCell)
        negsCount(gBoard)
        gGame.isFirstClick = false
        gGame.isOn = true
    }

    // if is mine
    if (currCell.isMine) {
        elCell.innerText = MINE
        gGame.lives--
        var lives = document.querySelector('.lives').innerText
        lives = lives.slice(2)
        document.querySelector('.lives').innerText = lives

        if (checkGameOver()) {
            gGame.isOn = false
            elSmiley.innerText = LOSE
            revealAllMines()
            clearInterval(gTimerInterval)
        }
    }

    //if is NOT mine and NOT first click
    if (!currCell.isMine) {
        elCell.style.color = '#c54914'
        elCell.innerText = currCell.minesAroundCount
    }

}



function plantFlag(elCell, cellI, cellJ) {
    var currCell = gBoard[cellI][cellJ]

    if (!gTimerInterval) startTimer()
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
    if (checkGameOver()) {
        elSmiley.innerText = WIN
        clearInterval(gTimerInterval)
    }
}



function checkGameOver() {
    // if all marked flags = all mines && all shown cells >= cells that are not mines
    if (gGame.flagCount === gLevel.mines && gGame.shownCount === gLevel.size ** 2 - gLevel.mines) return true
    if (gGame.shownCount >= (gLevel.size ** 2) - gLevel.mines)  return true
    if (gGame.lives === 0)  return true
    if (gGame.shownCount >= gLevel.size ** 2) return true 
    if (gGame.flagCount !== gLevel.mines && (gGame.shownCount - gGame.flagCount === gLevel.size ** 2 - gLevel.mines)) return true


    return false
}










function startTimer() {
    gTimerInterval = setInterval(() => {
        gGame.secsPassed++
        var elH2 = document.querySelector('.timer')
        elH2.innerText = '0' + gGame.secsPassed + '⏳'
    }, 1000);
}




function getEmptyCells(board) {
    var cells = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (!board[i][j].isMine) {
                cells.push({ i, j })
            } else i--
        }
    } return cells
}

function drawRandomCell(cells) {
    var randIdx = getRandomInt(0, cells.length)
    return cells.splice(randIdx, 1)[0]
}


function locateMines(currCell) {
    var cells = getEmptyCells(gBoard)
    var location = drawRandomCell(cells)
    console.log('location = ', location)
    for (var i = 0; i < gLevel.mines; i++) {
        location = drawRandomCell(cells)
        if (currCell !== location) {
            gBoard[location.i][location.j].isMine = true
        } else {
            location = drawRandomCell(cells)
            gBoard[location.i][location.j].isMine = true
        }
    }
}



// function showMines() {
//     var mines = []
//     for (var i = 0; i < gBoard.length ; i++) {
//         for (var j = 0 ; j < gBoard.length ; j++) {
//             if (gBoard[i][j].isMine) {
//                 mines.push({i, j})
//             }
//         }
//     }
//     console.log('mines = ', mines)
//     for (var i = 0 ; i < mines.length ; i++) {
      
//     }
// }
