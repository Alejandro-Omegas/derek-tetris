//#region Globals
let canvas
let ctx
let gBArrayHeight = 20
let gBArrayWidth = 12
let startX = 4
let startY = 0
let score = 0
let level = 1
let WinOrLose = "Playing"
let tetrisLogo
let coordinateArray = [...Array(gBArrayHeight)].map(e => Array(gBArrayWidth).fill(0))
//  #
// ### currTetromino
let currTetromino = [[1, 0], [0, 1], [1, 1], [2, 1]]
let tetrominos = []
let tetrominoColors = ['purple', 'cyan', 'blue', 'yellow', 'orange', 'green', 'red']
let currTetrominoColor
let gameBoardArray = [...Array(gBArrayHeight)].map(e => Array(gBArrayWidth).fill(0))
let stoppedShapeArray = [...Array(gBArrayHeight)].map(e => Array(gBArrayWidth).fill(0))
let DIRECTION = {
    IDLE: 0, DOWN: 1, LEFT: 2, RIGHT: 3
}
let direction
//#endregion

//#region Classes
class Coordinates {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
//#endregion

//#region Listeners
document.addEventListener('DOMContentLoaded', SetupCanvas)
//#endregion

//#region Functions
window.setInterval(function () {
    if (WinOrLose != "Game Over") {
        MoveTetrominoDown()
    }
}, 1000)

function CreateCoordArray() {
    let i = 0, j = 0

    for (let y = 9; y <= 446; y += 23) {
        for (let x = 11; x <= 264; x += 23) {
            coordinateArray[i][j] = new Coordinates(x, y)
            i++
        }
        j++
        i = 0
    }
}

function SetupCanvas() {
    canvas = document.getElementById('my-canvas')
    ctx = canvas.getContext('2d')
    canvas.width = 936
    canvas.height = 956

    //ctx.scale(2, 2); //'zooms' x2

    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.strokeStyle = 'black'
    ctx.strokeRect(8, 8, 280, 462)

    tetrisLogo = new Image(161, 54) //same size as your logo
    tetrisLogo.onload = DrawTetrisLogo
    tetrisLogo.src = "tetrislogo.png"

    ctx.fillStyle = 'black'
    ctx.font = '21px Arial'

    ctx.fillText("SCORE", 300, 98)
    ctx.strokeRect(300, 107, 161, 24)
    ctx.fillText(score.toString(), 310, 127)

    ctx.fillText("LEVEL", 310, 157)
    ctx.strokeRect(300, 171, 161, 24)
    ctx.fillText(level.toString(), 310, 190)

    ctx.fillText("WIN / LOSE", 300, 221)
    ctx.fillText(WinOrLose, 310, 261)
    ctx.strokeRect(300, 232, 161, 95)
    ctx.fillText("CONTROLS", 300, 354)
    ctx.strokeRect(300, 366, 161, 104)
    ctx.font = '19px Arial'
    ctx.fillText("A : Move Left", 310, 388)
    ctx.fillText("B : Move Right", 310, 413)
    ctx.fillText("S : Move Down", 310, 438)
    ctx.fillText("E : Rotate Right", 310, 463)

    document.addEventListener('keydown', HandleKeyPress)
    CreateTetrominos()
    CreateTetromino()

    CreateCoordArray()
    DrawTetromino()
}

function DrawTetrisLogo() {
    ctx.drawImage(tetrisLogo, 300, 8, 161, 54)
}

function DrawTetromino() {
    for (let i = 0; i < currTetromino.length; i++) {
        let x = currTetromino[i][0] + startX
        let y = currTetromino[i][1] + startY
        gameBoardArray[x][y] = 1
        let coorX = coordinateArray[x][y].x
        let coorY = coordinateArray[x][y].y
        ctx.fillStyle = currTetrominoColor
        ctx.fillRect(coorX, coorY, 21, 21)
    }
}

function DeleteTetromino() {
    for (let i = 0; i < currTetromino.length; i++) {
        let x = currTetromino[i][0] + startX
        let y = currTetromino[i][1] + startY
        gameBoardArray[x][y] = 0
        let coorX = coordinateArray[x][y].x
        let coorY = coordinateArray[x][y].y
        ctx.fillStyle = 'white'
        ctx.fillRect(coorX, coorY, 21, 21)
    }
}

function CreateTetrominos() {
    //T
    tetrominos.push([[1, 0], [0, 1], [1, 1], [2, 1]])
    //I
    tetrominos.push([[1, 0], [2, 0], [3, 0], [4, 0]])
    //J
    tetrominos.push([[0, 0], [0, 1], [1, 1], [2, 1]])
    //Square
    tetrominos.push([[0, 0], [1, 0], [0, 1], [1, 1]])
    //L
    tetrominos.push([[2, 0], [0, 1], [1, 1], [2, 1]])
    //S
    tetrominos.push([[1, 0], [2, 0], [0, 1], [1, 1]])
    //Z
    tetrominos.push([[0, 0], [1, 0], [1, 1], [2, 1]])
}

function CreateTetromino() {
    let randomTetromino = Math.floor(Math.random() * tetrominos.length)
    currTetromino = tetrominos[randomTetromino]
    currTetrominoColor = tetrominoColors[randomTetromino]
}

function HandleKeyPress(key) {
    if (WinOrLose != "Game Over") {
        if (key.keyCode === 65) { //A
            direction = DIRECTION.LEFT
            if (!HittingWall() && !CheckHorizontalCollision()) {
                DeleteTetromino()
                startX--
                DrawTetromino()
            }
        } else if (key.keyCode === 68) { //D
            direction = DIRECTION.RIGHT
            if (!HittingWall() && !CheckHorizontalCollision()) {
                DeleteTetromino()
                startX++
                DrawTetromino()
            }
        } else if (key.keyCode === 83) { //S
            MoveTetrominoDown()
        } else if (key.keyCode === 69) { //E
            RotateTetromino()
        }
    }
}

function MoveTetrominoDown() {
    direction = DIRECTION.DOWN

    if (!CheckVerticalCollision()) {
        DeleteTetromino()
        startY++
        DrawTetromino()
    }
}

function CheckVerticalCollision() {
    let tetrominoCopy = currTetromino
    let collision = false

    for (let i = 0; i < tetrominoCopy.length; i++) {
        let square = tetrominoCopy[i]
        let x = square[0] + startX
        let y = square[1] + startY

        if (direction === DIRECTION.DOWN) {
            y++
        }

        if (typeof stoppedShapeArray[x][y + 1] === 'string') {
            DeleteTetromino()
            startY++
            DrawTetromino()
            collision = true
            break
        }

        if (y >= 20) {
            collision = true
            break
        }
    }

    if (collision) {
        if (startY <= 2) {
            WinOrLose = "Game Over"
            ctx.fillStyle = 'white'
            ctx.fillRect(310, 242, 140, 30)
            ctx.fillStyle = 'black'
            ctx.fillText(WinOrLose, 310, 261)
        } else {
            for (let i = 0; i < tetrominoCopy.length; i++) {
                let square = tetrominoCopy[i]
                let x = square[0] + startX
                let y = square[1] + startY

                stoppedShapeArray[x][y] = currTetrominoColor
            }

            CheckForCompletedRows()
            CreateTetromino()
            
            direction = DIRECTION.IDLE
            startX = 4
            startY = 0
            DrawTetromino()
        }
    }
}

function CheckHorizontalCollision() {
    let tetrominoCopy = currTetromino
    let collision = false

    for (let i = 0; i < tetrominoCopy.length; i++) {
        let square = tetrominoCopy[i]
        let x = square[0] + startX
        let y = square[1] + startY

        if (direction === DIRECTION.LEFT) {
            x--;
        } else if (direction === DIRECTION.RIGHT) {
            x++
        }

        var stoppedShapeVal = stoppedShapeArray[x][y]

        if (typeof stoppedShapeArray === 'string') {
            collision = true
            break
        }
    }

    return collision
}

function HittingWall() {
    for (let i = 0; i < currTetromino.length; i++) {
        let newX = currTetromino[i][0] + startX

        if (newX <= 0 && direction === DIRECTION.LEFT) {
            return true
        } else if (newX >= (gBArrayWidth - 1) && direction === DIRECTION.RIGHT) {
            return true
        }
    }

    return false
}

function CheckForCompletedRows() {
    let rowsToDelete = 0
    let startOfDeletion = 0

    for (let y = 0; y < gBArrayHeight; y++) {
        let completed = true

        for (let x = 0; x < gBArrayWidth; x++) {
            let square = stoppedShapeArray[x][y]
            if (square === 0 || (typeof square === 'undefined')) {
                completed = false
                break
            }
        }

        if (completed) {
            if (startOfDeletion === 0) {
                startOfDeletion = y
            }

            rowsToDelete++

            for (let i = 0; i < gBArrayWidth; i++) {
                stoppedShapeArray[i][y] = 0
                gameBoardArray[i][y] = 0
                let coorX = coordinateArray[i][y].x
                let coorY = coordinateArray[i][y].y
                ctx.fillStyle = 'white'
                ctx.fillRect(coorX, coorY, 21, 21)
            }
        }
    }

    if (rowsToDelete > 0) {
        score += 10
        ctx.fillStyle = 'white'
        ctx.fillRect(310, 109, 140, 19)
        ctx.fillStyle = 'black'
        ctx.fillText(score.toString(), 310, 127)
        MoveAllRowsDown(rowsToDelete, startOfDeletion)
    }
}

/**
 * Moves all rows down by a specified number of rows starting from a given row.
 * This function is typically used in a Tetris game to clear completed rows and move the above rows down.
 *
 * @param {number} rowsToDelete - The number of rows to move down.
 * @param {number} startOfDeletion - The row index from which to start moving rows down.
 */
function MoveAllRowsDown(rowsToDelete, startOfDeletion) {
    for (var i = startOfDeletion - 1; i >= 0; i--) { // Loop through rows from startOfDeletion-1 to 0
        for (var x = 0; x < gBArrayWidth; x++) { // Loop through each column in the current row
            var y2 = i + rowsToDelete; // Calculate the new row index
            var square = stoppedShapeArray[x][i]; // Get the current square
            var nextSquare = stoppedShapeArray[x][y2]; // Get the square at the new position

            if (typeof square === 'string') { // If the current square is occupied
                nextSquare = square; // Move the square to the new position
                gameBoardArray[x][y2] = 1; // Update the game board array
                stoppedShapeArray[x][y2] = square; // Update the stopped shape array

                let coorX = coordinateArray[x][y2].x; // Get the x-coordinate for the new position
                let coorY = coordinateArray[x][y2].y; // Get the y-coordinate for the new position
                ctx.fillStyle = nextSquare; // Set the fill color to the square's color
                ctx.fillRect(coorX, coorY, 21, 21); // Draw the square at the new position

                square = 0; // Clear the original square
                gameBoardArray[x][i] = 0; // Update the game board array
                stoppedShapeArray[x][i] = 0; // Update the stopped shape array

                coorX = coordinateArray[x][i].x; // Get the x-coordinate for the original position
                coorY = coordinateArray[x][i].y; // Get the y-coordinate for the original position
                ctx.fillStyle = 'white'; // Set the fill color to white
                ctx.fillRect(coorX, coorY, 21, 21); // Clear the original square
            }
        }
    }
}

function RotateTetromino() {
    let newRotation = new Array()
    let tetrominoCopy = currTetromino
    let currTetrominoBU //backup

    for (let i = 0; i < tetrominoCopy.length; i++) {
        currTetromino = [...currTetromino]
        let x = tetrominoCopy[i][0]
        let y = tetrominoCopy[i][1]
        let newX = (GetLastSquareX() - y)
        let newY = x
        newRotation.push([newX, newY])
    }

    DeleteTetromino()

    try {
        currTetromino = newRotation
        DrawTetromino()
    } catch (e) {
        if (e instanceof TypeError) {
            currTetromino = currTetrominoBU
            DeleteTetromino()
            DrawTetromino()
        }
    }
}

function GetLastSquareX() {
    let lastX = 0

    for (let i = 0; i < currTetromino.length; i++) {
        let square = currTetromino[i]

        if (square[0] > lastX) {
            lastX = square[0]
        }
    }

    return lastX
}
//#endregion