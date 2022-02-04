/*-------------------------------- Constants --------------------------------*/
const BOARD_SIZE = 9


/*---------------------------- Variables (state) ----------------------------*/
let model


/*------------------------ Cached Element References ------------------------*/

//console.log(document.querySelectorAll('input')[0].value)


/*----------------------------- Event Listeners -----------------------------*/



/*-------------------------------- Classes --------------------------------*/


class Player {
  #playerNum
  #nextPlayer

  constructor(playerNum) {
    this.#playerNum = playerNum
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

}

class Model {
  #board
  #activePlayer
  #player1
  #player2
  #winner





  constructor () {
    this.#board = Array(BOARD_SIZE).fill(null)
    this.#player1 = new Player(1)
    this.#player2 = new Player(2)
    this.#activePlayer =this.#player1
  }

  setBoardAfterMove(boardIndex) {
    this.#board[boardIndex] = this.#activePlayer.getPlayerNum()
    this.#activePlayer = this.#activePlayer.getNextPlayer()
  }

  getBoard() {
    return [...this.#board]
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

}

class View {
  #controller

  constructor () {

  }

  setController (controller) {
    this.#controller = controller
  }

  display (board) {
    throw new Error('need to implement display function') 
  }

}

class HumanView extends View {

  display(board) {

  }

}

class AIView extends View {
  display(board) {
    //make move
  }
}


/*-------------------------------- Functions --------------------------------*/




(function init(){
model = new Model()
controller = new Controller()
view = new View()

controller.setModel(model)
controller.setView(view)

view.setController(controller)

})();
