/*-------------------------------- Constants --------------------------------*/
const BOARD_SIZE = 9
const humanPlayer = Symbol('humanPlayer')
const AIPlayerEasy = Symbol('AIPlayerEasy')
const AIPlayerMedium = Symbol('AIPlayerMedium')
const AIPlayerHard = Symbol('AIPlayerHard')
const EASY_DEPTH = 1
const MEDIUM_DEPTH = 4
const HARD_DEPTH = 9
const chars = ['X','O']


/*---------------------------- Variables (state) ----------------------------*/
let model
let controller
let view
let activePlayer
let gameActive = false

/*------------------------ Cached Element References ------------------------*/

const boxes = document.querySelectorAll('.board div')
const start = document.getElementById('start')
const restart = document.getElementById('restart')
const player1Type = document.getElementById('player1-type')
const player2Type = document.getElementById('player2-type')
const form = document.getElementById('form')
const activePlayerMsg = document.getElementById('active-player-msg')
const boardElement = document.getElementById('board')
const msg = document.getElementById('message')

//console.log(form)

/*----------------------------- Event Listeners -----------------------------*/

form.addEventListener('submit',onClickStart)
form.addEventListener('reset',onClickRestart)
boardElement.addEventListener('click',boardClicked)

/*-------------------------------- Classes --------------------------------*/


class Player {
  #chars
  #playerNum
  #nextPlayer

  constructor(playerNum) {
    this.#playerNum = playerNum
    this.#chars = ['X','O']
  }

  getPlayerNum () {
    return this.#playerNum
  }

  getNextPlayer() {
    return this.#nextPlayer
  }

  setNextPlayer(player) {
    this.#nextPlayer = player
  }

  makeDecision(board) {
    
  }

  getTextID () {
    return this.#chars[this.#playerNum-1]
  }

  isHumanPlayer() {
    throw new Error('implement me!')
  }

}


class HumanPlayer extends Player {
 // #playerNum
 // #nextPlayer

  constructor(playerNum) {
    super(playerNum)
    //this.#isHumanPlayer = true
  }

  isHumanPlayer() {
    return true
  }


}

class AIPlayer extends Player {
 // #playerNum
 // #nextPlayer
 #depth

  constructor(playerNum,depth) {
    super(playerNum)
    this.#depth = depth
    //this.#isHumanPlayer = false
  }

  isHumanPlayer() {
    return false
  }

  makeDecision(board) {
   // console.log(board)
   // controller.moveSelected(board.findIndex(el=>!el))
  }


}


class Model {
  #board
  //#activePlayer
  //#player1
  //#player2
  #winner
  #controller





  constructor () {
    this.#board = Array(BOARD_SIZE).fill(null)
    //this.#player1 = new Player(1)
    //this.#player2 = new Player(2)
    //this.#activePlayer =this.#player1
  }

  setBoardAfterMove(boardIndex) {
    this.#board[boardIndex] = activePlayer.getPlayerNum()
    //activePlayer = activePlayer.getNextPlayer()
    
    //this.#board[boardIndex] = this.#activePlayer.getPlayerNum()
    //this.#activePlayer = this.#activePlayer.getNextPlayer()
  }

  getBoard() {
    return [...this.#board]
  }

  setController (controller) {
    this.#controller = controller
  }

  
}

class Controller {
  #model
  #view
  constructor () {

  }

  setModel(model) {
    this.#model = model
  }

  setView(view) {
    this.#view = view
  }


  checkIfGameIsOver(board) {
    
      for (let i = 0; i < 3; i++) {
        if (board[i*3] && board[i*3] === board[i*3+1] && board[i*3] === board[i*3+2]) return board[i*3]
        if (board[i] && board[i] === board[i+3] && board[i] === board[i+6]) return board[i]
      }

      if (board[0] && board[0] === board[4] && board[0] === board[8]) return board[0]
      if (board[2] && board[2] === board[4] && board[2] === board[6]) return board[2]

      if (board.every(el=>el)) return 3 //tie

    return -1 //game is still in play
  }

  moveSelected(boxClickedIndex) {
    let currentBoard = this.#model.getBoard()
    if (!currentBoard[boxClickedIndex]) {
      this.#model.setBoardAfterMove(boxClickedIndex)
      currentBoard = this.#model.getBoard()
      //return currentBoard
      view.display(currentBoard)
      let outcome = this.checkIfGameIsOver(currentBoard)
      if (outcome > 0) view.gameOver(outcome)
      
      else {
        activePlayer = activePlayer.getNextPlayer()
        activePlayer.makeDecision(currentBoard)
      } 
    }
    //return null
  }

}

class View {
  #controller

  constructor () {

  }

  setController (controller) {
    this.#controller = controller
  }

  display (board) {
    //console.log('display')
    
    board.forEach((el,i) => el ? boxes[i].textContent = chars[el-1] : boxes[i].textContent = '')
    activePlayerMsg.textContent = `Active Player: ${activePlayer.getTextID()}`
  }

  boardClicked(boxClickedIndex) {
    //console.log('in view:', boxClickedIndex)
    this.#controller.moveSelected(boxClickedIndex)
  }

  gameOver(outcome) {
     // console.log('game over')
      gameActive = false
      msg.textContent = outcome < 3 ? `Player ${activePlayer.getTextID()} won!` : 'Tie game!'
  }

}



/*-------------------------------- Functions --------------------------------*/




function init(player1TypeValue,player2TypeValue){
const initPlayer = (str,playerNum) => {
  let newPlayer
  switch(str) {
    case 'human':
      //console.log('human case')
      newPlayer = new HumanPlayer(playerNum)
      break;
    case 'ai-easy':
      //console.log('ai-easy case')
      newPlayer = new AIPlayer(playerNum,EASY_DEPTH)
      break;
    case 'ai-medium':
      //console.log('ai-medium case')
      newPlayer = new AIPlayer(playerNum,MEDIUM_DEPTH)
      break;
    case 'ai-hard':
      //console.log('ai-hard case')
      newPlayer = new AIPlayer(playerNum,HARD_DEPTH)
      break;
  }

  return newPlayer
}

  const player1 = initPlayer(player1TypeValue,1)
  const player2 = initPlayer(player2TypeValue,2)

  //console.log(player1TypeValue)
model = new Model()
controller = new Controller()
view = new View()

model.setController(controller)
controller.setModel(model)
controller.setView(view)
view.setController(controller)

//const player1 = new Player(1, player1TypeValue)
//const player2 = new Player(2, player2TypeValue)


player1.setNextPlayer(player2)
player2.setNextPlayer(player1)

activePlayer = player1

//console.log(player1)
//console.log(player2)

};


function onClickStart (e) {
  e.preventDefault()
  start.disabled=true
  restart.disabled=false
  player1Type.disabled = true
  player2Type.disabled = true
  //boxes.forEach(box=>box.textContent = 'X')
  activePlayerMsg.textContent = 'Active Player: X'
  //console.log('start pressed')
  gameActive = true
  msg.textContent = 'Get three in a row to win!'
  init(player1Type.value,player2Type.value)
}

function onClickRestart (e) {
  //console.log('reset pressed')
  
  gameActive = false
  start.disabled=false
  restart.disabled=true
  player1Type.disabled = false
  player2Type.disabled = false
  boxes.forEach(box=>box.textContent = '')
  activePlayerMsg.textContent = 'Active Player: '
  msg.textContent = 'Press "start" below to begin game'
}

function boardClicked (e) {
  if (gameActive && activePlayer.isHumanPlayer() === true && !e.target.classList.contains('board')) {
  boxClickedIndex = parseInt(e.target.id[e.target.id.length -1])
  //console.log(boxClickedIndex)
  view.boardClicked(boxClickedIndex)
  }
}