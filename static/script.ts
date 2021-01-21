'use strict';

enum turn {
  Preflop,
  Flop,
  Turn,
  River,
}

let currentTurn : turn;
let playerHand : string[] = [null, null];
let board: string[] = [null, null, null, null, null];
let playerHandCardImages : Element[] = [];
let boardCardImages : Element[] = [];

function isValidCard(card: string): boolean {
  let regex = new RegExp('(([1]{1}[0]{1})|([2-9AaJjQqKk]{1}))[SsHhCcDd]{1}');
  console.log(regex.test(card));
  return regex.test(card);
}

function cardNotAlreadyUsed(card: string): boolean{
  for(let i = 0; i < playerHand.length; i++){
    let element = playerHand[i];
    if (element === card){
      return false;
    }
  }

  for(let i = 0; i < board.length; i++){
    let element = board[i];
    if (element === card){
      return false;
    }
  }

  return true;
}

function getCardUrl(card: string): string {
  let url = "";
  let rank;
  let suit;

  if (card.length == 2){
    rank = card[0].toLowerCase();
    suit = card[1].toLowerCase();
  } else if (card.length == 3) {
    rank = card[0] + card[1];
    console.log(rank);
    suit = card[2].toLowerCase();
  }else{
    return "error";
  }
  

  switch(suit){
    case 's':
      url += "0";
      break;
    case 'h':
      url += "1";
      break;
    case 'c':
      url += "2";
      break;
    case 'd':
      url += "3";
      break;
  }

  switch(rank){
    case 'a':
      url += "_1";
      break;
    case '2':
      url += "_2";
      break;
    case '3':
      url += "_3";
      break;
    case '4':
      url += "_4";
      break;
    case '5':
      url += "_5";
      break;
    case '6':
      url += "_6";
      break;
    case '7':
      url += "_7";
      break;
    case '8':
      url += "_8";
      break;
    case '9':
      url += "_9";
      break;
    case '10':
      url += "_10";
      break;
    case 'j':
      url += "_11";
      break;
    case 'q':
      url += "_12";
      break;
    case 'k':
      url += "_13";
      break;
  }

  url += ".svg";
  
  return url;
}

function updateCardImage(index: number, isInHand: boolean): void {
  if (isInHand){
    let cardUrl = getCardUrl(playerHand[index]);
    (<HTMLImageElement>playerHandCardImages[index]).src = "/static/deck-of-cards/faces/" + cardUrl;
  } else {
    let cardUrl = getCardUrl(board[index]);
    (<HTMLImageElement>boardCardImages[index]).src = "/static/deck-of-cards/faces/" + cardUrl;
  }
}

function handUpdated(card: string, index: number): void {
  if (card.length < 2){
    playerHand[index] = null;
  }
  else if (isValidCard(card) && cardNotAlreadyUsed(card)){
    playerHand[index] = card;
    updateCardImage(index, true);
  }
}

function boardUpdated(card: string, index: number): void {
  if (card.length < 2){
    board[index] = null;
  }
  else if (isValidCard(card) && cardNotAlreadyUsed(card)){
    board[index] = card;
    updateCardImage(index, false);
  }
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

  playerHandCardImages = Array.prototype.slice.call(document.getElementsByClassName("hand-card"));
  boardCardImages = Array.prototype.slice.call(document.getElementsByClassName("board-card"));
});
