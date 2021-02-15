'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var Turn;
(function (Turn) {
    Turn[Turn["Preflop"] = 0] = "Preflop";
    Turn[Turn["Flop"] = 1] = "Flop";
    Turn[Turn["Turn"] = 2] = "Turn";
    Turn[Turn["River"] = 3] = "River";
})(Turn || (Turn = {}));
let currentTurn;
let playerHand = [null, null];
let board = [null, null, null, null, null];
let handInputs = [null, null];
let boardInputs = [null, null, null, null, null];
let playerHandCardImages = [];
let boardCardImages = [];
let progressbarElems = [null, null, null, null];
let calculationProgressBar;
let calculationProgressPercent;
let calculationProgressText;
let calculationProgressBarUpdateInterval = 0;
let rangeElements = new Map();
let villainRange = new Set();
function isValidCard(card) {
    let regex = new RegExp('(([1]{1}[0]{1})|([2-9AaTtJjQqKk]{1}))[SsHhCcDd]{1}');
    return regex.test(card);
}
function cardNotAlreadyUsed(card) {
    for (let i = 0; i < playerHand.length; i++) {
        let element = playerHand[i];
        if (element === card) {
            return false;
        }
    }
    for (let i = 0; i < board.length; i++) {
        let element = board[i];
        if (element === card) {
            return false;
        }
    }
    return true;
}
function getCardUrl(card) {
    let url = "";
    let rank;
    let suit;
    if (card.length == 2) {
        rank = card[0].toLowerCase();
        suit = card[1].toLowerCase();
    }
    else if (card.length == 3) {
        rank = card[0] + card[1];
        console.log(rank);
        suit = card[2].toLowerCase();
    }
    else {
        return "error";
    }
    switch (suit) {
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
    switch (rank) {
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
function updateCardImage(index, isInHand) {
    if (isInHand) {
        let cardUrl = getCardUrl(playerHand[index]);
        playerHandCardImages[index].src = "/static/deck-of-cards/faces/" + cardUrl;
    }
    else {
        let cardUrl = getCardUrl(board[index]);
        boardCardImages[index].src = "/static/deck-of-cards/faces/" + cardUrl;
    }
}
function handUpdated(card, index) {
    if (card.length < 2) {
        playerHand[index] = null;
    }
    else if (isValidCard(card) && cardNotAlreadyUsed(card)) {
        playerHand[index] = card;
        updateCardImage(index, true);
    }
}
function boardUpdated(card, index) {
    if (card.length < 2) {
        board[index] = null;
    }
    else if (isValidCard(card) && cardNotAlreadyUsed(card)) {
        board[index] = card;
        updateCardImage(index, false);
    }
}
function addInputFieldEventListeners() {
    handInputs[0] = document.getElementsByName("hand1")[0];
    handInputs[0].addEventListener('input', function () {
        handUpdated(handInputs[0].value, 0);
    });
    handInputs[1] = document.getElementsByName("hand2")[0];
    handInputs[1].addEventListener('input', function () {
        handUpdated(handInputs[1].value, 1);
    });
    boardInputs[0] = document.getElementsByName("board1")[0];
    boardInputs[0].addEventListener('input', function () {
        boardUpdated(boardInputs[0].value, 0);
    });
    boardInputs[1] = document.getElementsByName("board2")[0];
    boardInputs[1].addEventListener('input', function () {
        boardUpdated(boardInputs[1].value, 1);
    });
    boardInputs[2] = document.getElementsByName("board3")[0];
    boardInputs[2].addEventListener('input', function () {
        boardUpdated(boardInputs[2].value, 2);
    });
    boardInputs[3] = document.getElementsByName("board4")[0];
    boardInputs[3].addEventListener('input', function () {
        boardUpdated(boardInputs[3].value, 3);
    });
    boardInputs[4] = document.getElementsByName("board5")[0];
    boardInputs[4].addEventListener('input', function () {
        boardUpdated(boardInputs[4].value, 4);
    });
}
function turnCompleted(current) {
    switch (current) {
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
function addProgressBarEventListeners() {
    progressbarElems[0] = document.getElementsByClassName("stepone")[0];
    progressbarElems[1] = document.getElementsByClassName("steptwo")[0];
    progressbarElems[2] = document.getElementsByClassName("stepthree")[0];
    progressbarElems[3] = document.getElementsByClassName("stepfour")[0];
    for (let i = 0; i < progressbarElems.length; i++) {
        progressbarElems[i].addEventListener('click', function () {
            turnCompleted(i);
        });
    }
}
function updateProgressBar() {
    progressbarElems[currentTurn].classList.remove("done");
    progressbarElems[currentTurn].classList.add("current");
    progressbarElems[currentTurn].classList.add("todo");
    for (let i = 0; i < currentTurn; i++) {
        progressbarElems[i].classList.remove("todo");
        progressbarElems[i].classList.remove("current");
        progressbarElems[i].classList.add("done");
    }
    for (let i = currentTurn + 1; i < 4; i++) {
        progressbarElems[i].classList.remove("current");
        progressbarElems[i].classList.remove("done");
        progressbarElems[i].classList.add("todo");
    }
}
function showTurnInputs() {
    switch (currentTurn) {
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
function postFormDataAsJson({ url, formData }) {
    return __awaiter(this, void 0, void 0, function* () {
        const fetchOptions = {
            method: "POST",
            body: formData
        };
        const response = yield fetch(url, fetchOptions);
        if (!response.ok) {
            const errorMessage = yield response.text();
            throw new Error(errorMessage);
        }
        return response.json();
    });
}
function postRangeDataAsJson() {
    return __awaiter(this, void 0, void 0, function* () {
        const data = { range: Array.from(villainRange) };
        const response = yield fetch("/range", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        }).then(res => {
            console.log("Request complete! response:", res);
        });
        console.log(data);
        return response;
    });
}
function handleFormSubmit(event) {
    return __awaiter(this, void 0, void 0, function* () {
        let odds = document.getElementById("app");
        odds.innerText = "";
        event.preventDefault();
        const form = event.currentTarget;
        const url = form.action;
        try {
            let formData = new FormData(form);
            let hero_hand = formData.get('hand1') + (formData.get('hand2'));
            formData.append('action', 'RFI');
            formData.append('villain_position', 'BU');
            formData.append('hero_position', 'CO');
            formData.append('hero_hand', hero_hand);
            const responseData = yield postFormDataAsJson({ url, formData });
            let contentDiv = document.getElementById('app');
            contentDiv.innerHTML = responseData.win;
        }
        catch (error) {
            console.error(error);
        }
    });
}
function checkIfCalculationFinished() {
    let odds = document.getElementById("app");
    if (odds) {
        let oddsInnerText = odds.innerText;
        if (oddsInnerText != '') {
            hideLoadingBar();
        }
    }
}
function showLoadingBar() {
    calculationProgressBar.classList.replace('hidden', 'visible');
    calculationProgressBarUpdateInterval = window.setInterval(checkIfCalculationFinished, 10); // Update the progress bar every 10ms.
}
function hideLoadingBar() {
    calculationProgressBar.classList.replace('visible', 'hidden');
    window.clearInterval(calculationProgressBarUpdateInterval);
}
function addFormEventListener() {
    const form = document.getElementById('calculate_form');
    form.addEventListener('submit', handleFormSubmit);
    form.addEventListener('submit', showLoadingBar);
}
function removeCombinationFromVillainRange(combination) {
    let combinationElement = rangeElements.get(combination);
    let reverseCombination = combination[1] + combination[0];
    let reverseCombinationElement = rangeElements.get(reverseCombination);
    combinationElement.classList.replace('selected-combination', 'unselected-combination');
    reverseCombinationElement.classList.replace('selected-combination', 'unselected-combination');
    villainRange.delete(combination);
    villainRange.delete(reverseCombination);
}
function addCombinationToVillainRange(combination) {
    let reverseCombination = combination[1] + combination[0];
    villainRange.add(combination);
    villainRange.add(reverseCombination);
    let combinationElement = rangeElements.get(combination);
    let reverseCombinationElement = rangeElements.get(reverseCombination);
    combinationElement.classList.replace('unselected-combination', 'selected-combination');
    reverseCombinationElement.classList.replace('unselected-combination', 'selected-combination');
}
function rangeButtonClicked(combination) {
    if (villainRange.has(combination)) {
        removeCombinationFromVillainRange(combination);
    }
    else {
        addCombinationToVillainRange(combination);
    }
    postRangeDataAsJson();
}
function addRangeElementListeners() {
    let rangeElementsList = document.getElementsByClassName('range-element-inner');
    for (let i = 0; i < rangeElementsList.length; i++) {
        let rangeElement = rangeElementsList[i];
        let rangeCombinationString = rangeElementsList[i].children[0].innerHTML;
        rangeElements.set(rangeCombinationString, rangeElement);
        rangeElementsList[i].addEventListener('click', function () {
            rangeButtonClicked(rangeCombinationString);
        });
    }
}
window.addEventListener('load', function () {
    calculationProgressBar = document.getElementsByClassName('calculation-progress-bar-container')[0];
    calculationProgressPercent = document.getElementsByClassName('level')[0];
    calculationProgressText = document.getElementById('calculation-progress-txt');
    addInputFieldEventListeners();
    addProgressBarEventListeners();
    addFormEventListener();
    addRangeElementListeners();
    currentTurn = Turn.Preflop;
    showTurnInputs();
    playerHandCardImages = Array.prototype.slice.call(document.getElementsByClassName("hand-card"));
    boardCardImages = Array.prototype.slice.call(document.getElementsByClassName("board-card"));
});
