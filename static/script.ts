'use strict';

enum turn {
  Preflop,
  Flop,
  Turn,
  River,
}

let currentTurn : turn;
let playerHand : string[] = [];
let board: string[] = [];

function isValidCard(value: string): boolean {
  if (value.length != 2)
    return false;
  let suit : string = value[0];
  let rank : string = value[1];
  switch(suit){
    case 's':
      break;
    case 'c':
      break;
    case 'd':
      break;
    case 'h':
      break;
  }

  return false;
}

function handUpdated(value: string, index: number): void {
  if (value.length == 2){
    playerHand[index] = value;
  }

  console.log(playerHand);
}

function boardUpdated(value: string, index: number): void {
  if (value.length == 2){
    board[index] = value;
  }

  console.log(board);
}

window.addEventListener('load', function () {
  currentTurn = turn.Preflop;

  let handInput1 = document.getElementsByName("hand1")[0];
  handInput1.addEventListener('input', function (evt) {
    handUpdated((<HTMLInputElement>handInput1).value, 0);
  });

  let handInput2 = document.getElementsByName("hand2")[0];
  handInput2.addEventListener('input', function (evt) {
    handUpdated((<HTMLInputElement>handInput2).value, 1);
  });

  let boardInput1 = document.getElementsByName("board1")[0];
  boardInput1.addEventListener('input', function (evt) {
    boardUpdated((<HTMLInputElement>boardInput1).value, 0);
  });

  let boardInput2 = document.getElementsByName("board2")[0];
  boardInput2.addEventListener('input', function (evt) {
    boardUpdated((<HTMLInputElement>boardInput2).value, 1);
  });

  let boardInput3 = document.getElementsByName("board3")[0];
  boardInput3.addEventListener('input', function (evt) {
    boardUpdated((<HTMLInputElement>boardInput3).value, 2);
  });

  let boardInput4 = document.getElementsByName("board4")[0];
  boardInput4.addEventListener('input', function (evt) {
    boardUpdated((<HTMLInputElement>boardInput4).value, 3);
  });

  let boardInput5 = document.getElementsByName("board5")[0];
  boardInput5.addEventListener('input', function (evt) {
    boardUpdated((<HTMLInputElement>boardInput5).value, 4);
  });

});
