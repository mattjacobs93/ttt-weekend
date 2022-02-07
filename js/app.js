/*-------------------------------- Constants --------------------------------*/
const BOARD_SIZE = 9
const humanPlayer = Symbol('humanPlayer')
const AIPlayerEasy = Symbol('AIPlayerEasy')
const AIPlayerMedium = Symbol('AIPlayerMedium')
const AIPlayerHard = Symbol('AIPlayerHard')
const EASY_DEPTH = 1
const MEDIUM_DEPTH = 4
const HARD_DEPTH = 12
const chars = ['X','O']
const waysToWinArray = ['036','147','258','012','345','678','048','246']


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
const divs = document.querySelectorAll('div')

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
  #hoverColor
  

  constructor(playerNum) {
    this.#playerNum = playerNum
    this.#chars = ['X','O']
    this.#hoverColor = (playerNum === 1) ? 'red' : 'blue'
  }

  getPlayerNum () {
    return this.#playerNum
  }

  getNextPlayer() {
    divs.forEach(div=>{div.setAttribute('class',this.#hoverColor)})
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

  constructor(playerNum) {
    super(playerNum)
  }

  isHumanPlayer() {
    return true
  }


}

class AIPlayer extends Player {

  #depth 

  constructor(playerNum,depth) {
    super(playerNum)
    this.#depth = depth
    
    
    
  }

  isHumanPlayer() {
    return false
  }

  makeDecision(board) {


    function getOpponentNum(myNum) {
      return Math.max(((myNum)+1)%3,1)
    }

    function minimax  (board, currDepth, maxDepth,player) {


      let gameOver = controller.checkIfGameIsOver(board)

      if (gameOver===1) return Infinity
      if (gameOver===2) return -1*Infinity
      if (gameOver===3) return 0



      const makeChildren = (board,player) => {
        let children = []
    
        for (let i = 0; i < BOARD_SIZE; i++) {
          if (!board[i]) {
            
            let child = [...board]
            child[i] = player
            children.push(child)
          }
        }
        return children
      }


      const numWaysPlayerWins = (num,board) => {
        let opponent = Math.max(((num + 1) % 3),1)
        let possibleWaystoWin = waysToWinArray.filter(w => {return w.split('').map(num=> { return board[parseInt(num)] === opponent ? 1 : 0  }).reduce((a,c)=>a+c) === 0})
       
        console.log('In Num Ways to Win:',board,num,possibleWaystoWin,possibleWaystoWin.length)
        return possibleWaystoWin.length
    }
  
    const evaluateBoard = board => {
      return numWaysPlayerWins(1,board) - numWaysPlayerWins(2,board)
    }

      if (currDepth === maxDepth) return evaluateBoard(board)

      
      let opponentNum = getOpponentNum(player)
      let children = makeChildren(board,player)

      if (children.length === 0) return evaluateBoard(board)

      let maxValue = -1000000
      let minValue = 10000000
      for (let child of children) {
        let currVal = minimax (child, currDepth+1, maxDepth,opponentNum) 
        if (currVal > maxValue) maxValue = currVal
        if (currVal < minValue) minValue = currVal
      } 

      if (player === 1) return maxValue
      else return minValue
    }


    let myNum = super.getPlayerNum()
  
  let opponentNum = getOpponentNum(myNum)

    let currDepth = 0
    let maxDepth = this.#depth
    
    let minValue = 1000000000
    let maxValue = -100000000
    let iMax = -1
    let iMin = -1
    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        let childBoard = [...board]
        childBoard[i] = myNum
        let currMinimax = minimax (childBoard, currDepth, maxDepth,opponentNum) 
        if (currMinimax > maxValue) {maxValue = currMinimax;iMax=i}
        if (currMinimax < minValue) {minValue = currMinimax;iMin=i}

      }
    }

    if (iMax === -1) {
      for (let i = 0; i < BOARD_SIZE; i++) {
        if (!board[i]) {
          iMax = i
          break
        }
      }
    }


    if (iMin === -1) {
      for (let i = 0; i < BOARD_SIZE; i++) {
        if (!board[i]) {
          iMin = i
          break
        }
      }
    }

    console.log('imax/imin: ',iMin,iMax)
    if (super.getPlayerNum()===1) view.boardClicked(iMax)
    else view.boardClicked(iMin)
  }


}


class Model {
  #board
  #winner
  #controller





  constructor () {
    this.#board = Array(BOARD_SIZE).fill(null)
  }

  setBoardAfterMove(boardIndex) {
    this.#board[boardIndex] = activePlayer.getPlayerNum()
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
      view.display(currentBoard)
      let outcome = this.checkIfGameIsOver(currentBoard)
      if (outcome > 0) view.gameOver(outcome)
      
      else {
        activePlayer = activePlayer.getNextPlayer()
        //testing
        view.display(currentBoard)
        //testing
        activePlayer.makeDecision(currentBoard)
      } 
    }
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
    board.forEach((el,i) => el ? boxes[i].textContent = chars[el-1] : boxes[i].textContent = '')
    activePlayerMsg.textContent = `Active Player: ${activePlayer.getTextID()}`
  }

  boardClicked(boxClickedIndex) {
    this.#controller.moveSelected(boxClickedIndex)
  }

  gameOver(outcome) {
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
      newPlayer = new HumanPlayer(playerNum)
      break;
    case 'ai-easy':
      newPlayer = new AIPlayer(playerNum,EASY_DEPTH)
      break;
    case 'ai-medium':
      newPlayer = new AIPlayer(playerNum,MEDIUM_DEPTH)
      break;
    case 'ai-hard':
      newPlayer = new AIPlayer(playerNum,HARD_DEPTH)
      break;
  }

  return newPlayer
}

  const player1 = initPlayer(player1TypeValue,1)
  const player2 = initPlayer(player2TypeValue,2)

model = new Model()
controller = new Controller()
view = new View()

model.setController(controller)
controller.setModel(model)
controller.setView(view)
view.setController(controller)

player1.setNextPlayer(player2)
player2.setNextPlayer(player1)

activePlayer = player1
activePlayer.makeDecision(Array(BOARD_SIZE))
};


function onClickStart (e) {
  e.preventDefault()
  start.disabled=true
  restart.disabled=false
  player1Type.disabled = true
  player2Type.disabled = true
  activePlayerMsg.textContent = 'Active Player: X'
  gameActive = true
  msg.textContent = 'Get three in a row to win!'
  init(player1Type.value,player2Type.value)
}

function onClickRestart (e) {

  
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
  view.boardClicked(boxClickedIndex)
  }


  //remove the below else block to disable start by clicking, glitches if AI is first, but human clicks to start

  else {
    //gameActive = true
    //boxClickedIndex = parseInt(e.target.id[e.target.id.length -1])
    //view.boardClicked(boxClickedIndex)
    onClickStart(e)
    controller.moveSelected(e.target.id[e.target.id.length -1])
    //view.display()

  }
}


