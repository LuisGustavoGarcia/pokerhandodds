'use strict';
var turn;
(function (turn) {
    turn[turn["Preflop"] = 0] = "Preflop";
    turn[turn["Flop"] = 1] = "Flop";
    turn[turn["Turn"] = 2] = "Turn";
    turn[turn["River"] = 3] = "River";
})(turn || (turn = {}));
var currentTurn;
var playerHand = [];
var board = [];
function handUpdated(value, index) {
    if (value.length == 2) {
        playerHand[index] = value;
    }
    console.log(playerHand);
}
function boardUpdated(value, index) {
    if (value.length == 2) {
        board[index] = value;
    }
    console.log(board);
}
window.addEventListener('load', function () {
    currentTurn = turn.Preflop;
    var handInput1 = document.getElementsByName("hand1")[0];
    handInput1.addEventListener('input', function (evt) {
        handUpdated(handInput1.value, 0);
    });
    var handInput2 = document.getElementsByName("hand2")[0];
    handInput2.addEventListener('input', function (evt) {
        handUpdated(handInput2.value, 1);
    });
    var boardInput1 = document.getElementsByName("board1")[0];
    boardInput1.addEventListener('input', function (evt) {
        boardUpdated(boardInput1.value, 0);
    });
    var boardInput2 = document.getElementsByName("board2")[0];
    boardInput2.addEventListener('input', function (evt) {
        boardUpdated(boardInput2.value, 1);
    });
    var boardInput3 = document.getElementsByName("board3")[0];
    boardInput3.addEventListener('input', function (evt) {
        boardUpdated(boardInput3.value, 2);
    });
    var boardInput4 = document.getElementsByName("board4")[0];
    boardInput4.addEventListener('input', function (evt) {
        boardUpdated(boardInput4.value, 3);
    });
    var boardInput5 = document.getElementsByName("board5")[0];
    boardInput5.addEventListener('input', function (evt) {
        boardUpdated(boardInput5.value, 4);
    });
});
