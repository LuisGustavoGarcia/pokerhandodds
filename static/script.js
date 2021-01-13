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

  var $container = document.getElementById('deck');

  // Create Deck.
  deck = Deck();
  deck.intro();
  deck.bysuit();
  deck.flip();

  // Add deck to DOM.
  deck.mount($container);

  // Add onclick listener to each card.
  const cards = deck.cards;
  for (var i = 0; i < cards.length; i++){
    cards[i].$el.addEventListener('click', function(e){ printCard(e) }, false);
  }

});
