/**
 * Copyright 2018, Google LLC
 * Licensed under the Apache License, Version 2.0 (the `License`);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an `AS IS` BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var deck;

function printCard(event){
  var card = event.currentTarget;
  var suit = card.classList[1];
  var rank = card.classList[2];
  console.log(suit, rank);
}

window.addEventListener('load', function () {

  var $suit1 = document.getElementById('suite1');
  var $suit2 = document.getElementById('suite2');
  var $suit3 = document.getElementById('suite3');
  var $suit4 = document.getElementById('suite4');

  // Create Deck.
  deck = Deck();
  deck.flip();
  
  // Add onclick listener to each card.
  const cards = deck.cards;
  for (var i = 0; i < cards.length; i++){
    cards[i].$el.addEventListener('click', function(e){ printCard(e) }, false);
  }

  // Add cards by suit to their own rows.
  for (var rank = 0; rank < 13; rank++){
    for (var suit = 0; suit < 4; suit++){
      var index = (suit * 13) + rank;
      switch(suit){
        case 0:
          $suit1.appendChild(deck.cards[index].$el);
          break;
        case 1:
          $suit2.appendChild(deck.cards[index].$el);
          break;
        case 2:
          $suit3.appendChild(deck.cards[index].$el);
          break;
        case 3:
          $suit4.appendChild(deck.cards[index].$el);
          break;
      }
    }
  }

});
