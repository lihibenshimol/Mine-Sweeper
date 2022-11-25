function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// בודק אם מוקש ומעלה את ספירת המוקשים
function setMinesNegCount(cellI, cellJ, mat) {
    var minesAroundCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= mat[i].length) continue

            if (mat[i][j].isMine) minesAroundCount++
        }
    }
    return minesAroundCount
}


function buildBoard(size) {
    const board = []

    for (var i = 0; i < size; i++) {
        board[i] = []
        for (var j = 0; j < size; j++) {
            board[i][j] = { minesAroundCount: 0, isShown: false, isMine: false, isMarked: false }
        }
    }

    // console.table(board)
    return board
}



function renderCell(location, value) {
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}


// סופר מוקשים לכל תא
function negsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            var currCell = board[i][j]
            currCell.minesAroundCount = setMinesNegCount(i, j, board)
        }
    }
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


function expandShown(board, cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= board[i].length) continue
            if (!gBoard[i][j].isShown) {
                var elCell = document.querySelector(`.cell-${i}-${j}`)
                elCell.classList.add('shown')
                elCell.innerText = EMPTY
                gBoard[i][j].isShown = true
                gGame.shownCount++
            }
        }
    }
}

function onToggleModal(text = '', shouldOpen = false) {
    const elModal = document.querySelector('.modal')
    var elModalSub = document.querySelector('.modal h2')
    elModalSub.innerText = text
    elModal.style.display = shouldOpen ? 'block' : 'none'
}
