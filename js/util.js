function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

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

    return board
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

function renderCell(location, value) {
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}

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
            if (!board[i][j].isMine && !board[i][j].isShown) {
                cells.push({ i, j })
            }
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
           var currCell = board[i][j]
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= board[i].length) continue
            if (currCell.isShown) continue
                var elCell = document.querySelector(`.cell-${i}-${j}`)
                elCell.classList.add('shown')
                elCell.innerText = currCell.minesAroundCount
                currCell.isShown = true
                gGame.shownCount++            
        }
    }
}



function onToggleModal(text = '', shouldOpen = false) {
    const elModal = document.querySelector('.modal')
    var elModalSub = document.querySelector('.modal h2')
    elModalSub.innerText = text
    elModal.style.display = shouldOpen ? 'block' : 'none'
}

function lose() {
    gGame.isOn = false
    elSmiley.innerText = LOSE
    showMines()
    clearInterval(gTimerInterval)
    onToggleModal('GAME OVER', true)
    playLose()
}

function win() {
    gGame.isOn = false
    elSmiley.innerText = WIN
    clearInterval(gTimerInterval)
    onToggleModal('YOU WIN!🎉', true)
    playWin()
}

function expandHint(board, cellI, cellJ) {
    var hintCells = []
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= board[i].length) continue
            var currCell = board[i][j]
            var elHinted = document.querySelector(`.cell-${i}-${j}`)
            elHinted.classList.add('shown')
            if (currCell.isMine) {
                elHinted.innerText = MINE
            } else {
                elHinted.innerText = currCell.minesAroundCount
            }
            hintCells.push(elHinted)
        }
    }
    gIsHint = !gIsHint

    var hintInterval = setInterval(() => {
        for (var i = 0; i < hintCells.length; i++) {
            hintCells[i].classList.remove('shown')
        }
        clearInterval(hintInterval)
        gGame.hints--
    }, 1000);
}

function playWin() {
    var sound = new Audio('sound/youWin.mp3');
    sound.play();
}

function playLose() {
    var sound = new Audio('sound/gameOver.mp3');
    sound.play();
}