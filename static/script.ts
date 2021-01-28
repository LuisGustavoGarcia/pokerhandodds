'use strict';

enum Turn {
  Preflop,
  Flop,
  Turn,
  River,
}

let currentTurn : Turn;
let playerHand : string[] = [null, null];
let board: string[] = [null, null, null, null, null];
let handInputs : Element[] = [null, null];
let boardInputs : Element[] = [null, null, null, null, null];
let playerHandCardImages : Element[] = [];
let boardCardImages : Element[] = [];
let progressbarElems : Element[] = [null, null, null, null];

let calculationProgressBar : Element;
let calculationProgressPercent : Element;
let calculationProgressText : Element;
let calculationProgressBarUpdateInterval = 0;

function isValidCard(card: string): boolean {
  let regex = new RegExp('(([1]{1}[0]{1})|([2-9AaTtJjQqKk]{1}))[SsHhCcDd]{1}');
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
    case 't':
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

function addInputFieldEventListeners(): void {
  handInputs[0] = document.getElementsByName("hand1")[0];
  handInputs[0].addEventListener('input', function () {
    handUpdated((<HTMLInputElement>handInputs[0]).value, 0);
  });

  handInputs[1] = document.getElementsByName("hand2")[0];
  handInputs[1].addEventListener('input', function () {
    handUpdated((<HTMLInputElement>handInputs[1]).value, 1);
  });

  boardInputs[0] = document.getElementsByName("board1")[0];
  boardInputs[0].addEventListener('input', function () {
    boardUpdated((<HTMLInputElement>boardInputs[0]).value, 0);
  });

  boardInputs[1] = document.getElementsByName("board2")[0];
  boardInputs[1].addEventListener('input', function () {
    boardUpdated((<HTMLInputElement>boardInputs[1]).value, 1);
  });

  boardInputs[2] = document.getElementsByName("board3")[0];
  boardInputs[2].addEventListener('input', function () {
    boardUpdated((<HTMLInputElement>boardInputs[2]).value, 2);
  });

  boardInputs[3] = document.getElementsByName("board4")[0];
  boardInputs[3].addEventListener('input', function () {
    boardUpdated((<HTMLInputElement>boardInputs[3]).value, 3);
  });

  boardInputs[4] = document.getElementsByName("board5")[0];
  boardInputs[4].addEventListener('input', function () {
    boardUpdated((<HTMLInputElement>boardInputs[4]).value, 4);
  });
}

function turnCompleted(current: number): void {
  switch(current){
    case Turn.Preflop:
      currentTurn = Turn.Preflop;
      break;
    case Turn.Flop:
      currentTurn = Turn.Flop;
      break;
    case Turn.Turn:
      currentTurn = Turn.Turn;
      break;
    case Turn.River:
      currentTurn = Turn.River;
      break;
  }
  updateProgressBar();
  showTurnInputs();
}

function addProgressBarEventListeners(): void {
  progressbarElems[0] = document.getElementsByClassName("stepone")[0];
  progressbarElems[1] = document.getElementsByClassName("steptwo")[0];
  progressbarElems[2] = document.getElementsByClassName("stepthree")[0];
  progressbarElems[3] = document.getElementsByClassName("stepfour")[0];

  for (let i = 0; i < progressbarElems.length; i++) {
    progressbarElems[i].addEventListener('click', function() {
      turnCompleted(i);
    });
  }
}

function updateProgressBar(): void {
  progressbarElems[currentTurn].classList.remove("done");
  progressbarElems[currentTurn].classList.add("current");
  progressbarElems[currentTurn].classList.add("todo");

  for (let i = 0; i < currentTurn; i++){
    progressbarElems[i].classList.remove("todo");
    progressbarElems[i].classList.remove("current");
    progressbarElems[i].classList.add("done");
  }

  for (let i = currentTurn + 1; i < 4; i++){
    progressbarElems[i].classList.remove("current");
    progressbarElems[i].classList.remove("done");
    progressbarElems[i].classList.add("todo");
  }
}

function showTurnInputs(): void {
  switch(currentTurn){
    case Turn.Preflop:
      handInputs[0].classList.replace("hidden", "visible");
      handInputs[1].classList.replace("hidden", "visible");

      boardInputs[0].classList.replace("visible", "hidden");
      boardInputs[1].classList.replace("visible", "hidden");
      boardInputs[2].classList.replace("visible", "hidden");
      boardInputs[3].classList.replace("visible", "hidden");
      boardInputs[4].classList.replace("visible", "hidden");
      break;
    case Turn.Flop:
      handInputs[0].classList.replace("visible", "hidden");
      handInputs[1].classList.replace("visible", "hidden");

      boardInputs[0].classList.replace("hidden", "visible");
      boardInputs[1].classList.replace("hidden", "visible");
      boardInputs[2].classList.replace("hidden", "visible");
      boardInputs[3].classList.replace("visible", "hidden");
      boardInputs[4].classList.replace("visible", "hidden");
      break;
    case Turn.Turn:
      handInputs[0].classList.replace("visible", "hidden");
      handInputs[1].classList.replace("visible", "hidden");

      boardInputs[0].classList.replace("visible", "hidden");
      boardInputs[1].classList.replace("visible", "hidden");
      boardInputs[2].classList.replace("visible", "hidden");
      boardInputs[3].classList.replace("hidden", "visible");
      boardInputs[4].classList.replace("visible", "hidden");
      break;
    case Turn.River:
      handInputs[0].classList.replace("visible", "hidden");
      handInputs[1].classList.replace("visible", "hidden");

      boardInputs[0].classList.replace("visible", "hidden");
      boardInputs[1].classList.replace("visible", "hidden");
      boardInputs[2].classList.replace("visible", "hidden");
      boardInputs[3].classList.replace("visible", "hidden");
      boardInputs[4].classList.replace("hidden", "visible");
      break;
  }
}

async function postFormDataAsJson({ url, formData }) {
  const fetchOptions = {
    method: "POST",
    body: formData
  };
  const response = await fetch(url, fetchOptions);
  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
  return response.json();
}

async function handleFormSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const url = form.action;

  try {
    let formData = new FormData(form);
    let hero_hand = <string>formData.get('hand1') + <string>(formData.get('hand2'));
    formData.append('action', 'RFI');
    formData.append('villain_position', 'BU');
    formData.append('hero_position', 'CO');
    formData.append('hero_hand', hero_hand);

    const responseData = await postFormDataAsJson({ url, formData });
    let contentDiv = document.getElementById('app');
    contentDiv.innerHTML = responseData.win;
  } catch (error) {
    console.error(error);
  }
}

function checkIfCalculationFinished(){
  let odds = document.getElementById("app");
  if (odds) {
    let oddsInnerText = odds.innerText;
    if (oddsInnerText != ''){
      hideLoadingBar();
    }
  }
}

function showLoadingBar(){
  calculationProgressBar.classList.replace('hidden', 'visible');
  calculationProgressBarUpdateInterval = window.setInterval(checkIfCalculationFinished, 10); // Update the progress bar every 10ms.
}

function hideLoadingBar(){
  calculationProgressBar.classList.replace('visible', 'hidden');
  window.clearInterval(calculationProgressBarUpdateInterval);
}

function addFormEventListener(){
  const form = document.getElementById('calculate_form');
  form.addEventListener('submit', handleFormSubmit);
  form.addEventListener('submit', showLoadingBar);
}

window.addEventListener('load', function () {
  calculationProgressBar = document.getElementsByClassName('calculation-progress-bar-container')[0];
  calculationProgressPercent = document.getElementsByClassName('level')[0];
  calculationProgressText = document.getElementById('calculation-progress-txt');

  addInputFieldEventListeners();
  addProgressBarEventListeners();
  addFormEventListener();
  
  currentTurn = Turn.Preflop;
  showTurnInputs();

  playerHandCardImages = Array.prototype.slice.call(document.getElementsByClassName("hand-card"));
  boardCardImages = Array.prototype.slice.call(document.getElementsByClassName("board-card"));
});
