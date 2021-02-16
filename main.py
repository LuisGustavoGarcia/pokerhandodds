# Copyright 2018 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import datetime

from poker.hand import Combo,Hand,Range
from calculation import holdem_calc

from flask import Flask, render_template, redirect, url_for, request, json
import asyncio
import numpy as np
#import pandas as pd

app = Flask(__name__)
#Narrows villians range by taking the preflop action as input
#Hero will be RFI / vs. Raise / vs. 3-bet / 4-bet / etc. against x position to narrow ranges
#Assumes GTO preflop 100BB deep and hero follows charts

def narrowRange(action, villian_position):
    #Button RFI range -> Villian is on the button and raises first
    if action == "RFI" and villian_position == "BU":
        return Range('22+,A2s+,K2s+,Q2s+,J2s+,T2s+,95s+,85s+,74s+,63s+,53s+,43s,A2o+,K8o+,Q8o+,J8o+,T8o+,97o+,87o,76o,65o,54o')
    #CO RFI
    #HJ RFI
    #LJ RFI

    #Button 3-bet
    #CO 3-bet
    #HJ 3-bet

    #CO 4-bet
    #Button 5-bet
    return None

def getVillianRange(action, villain_position, hero_position):
    #Button RFI range -> Villian is on the button and raises first
    if action == "RFI" and villain_position == "BU":
        return Range('22+,A2s+,K2s+,Q2s+,J2s+,T2s+,95s+,85s+,74s+,63s+,53s+,43s,A2o+,K8o+,Q8o+,J8o+,T8o+,97o+,87o,76o,65o,54o')
    elif action == "RFI" and villain_position == "CO":
        return Range('22+,A2s+,K2s+,Q5s+,J6s+,T6s+,96s+,85s+,75s+,65s,54s,A5o+,K9o+,QTo+')
    elif action == "RFI" and villain_position == "HJ":
        return Range('22+,A2s+,K2s+,Q5s+,J6s+,T6s+,96s+,85s+,75s+,65s,54s,A5o+,K9o+,QTo+')
    elif action == "RFI" and villain_position == "HJ":
        return Range('22+,A2s+,K3s+,Q6s+,J7s+,T7s+,98s,86s+,76s,65s,A8o+,KJo+,QJo')
    elif action == "RFI" and villain_position == "LJ":
        return Range('33+,A2s+,K7s+,Q9s+,J9s+,T9s,98s,87s,76s,65s,A9o+,KTo+,QTo+,JTo')
    #Button 3bet Range
    elif action == "3bet" and villain_position == "BU":
        if hero_position == "CO":
            return Range('TT+,55,AQs+,A9s-A6s,A4s-A3s,K9s,K7s,QJs,Q9s,J9s,AKo,AJo-ATo,KJo+,QJo')
        elif hero_position == "HJ":
            return Range('JJ+,66,AQs+,A9s-A6s,A4s-A3s,KTs-K8s,QTs-Q9s,T9s,AKo,AJo,KQo')
        elif hero_position == "LJ":
            return Range('JJ+,AQs+,A9s-A8s,A4s-A3s,K9s,QJs,T9s,AKo,AJo,KQo')
    elif action == "3bet" and villain_position == "CO":
        if hero_position == "HJ":
            return Range('88+,A9s+,A5s-A4s,KTs+,QJs,AJo+,KQo')
        elif hero_position == "LJ":
            return Range('88+,ATs+,A5s,KTs+,QJs,AQo+,KQo')
    elif action == "3bet" and villain_position == "HJ":
        if hero_position == "LJ":
            return Range('99+,ATs+,A5s,KTs+,QJs,AQo+,KQo')
    #3-bet call
    elif action == "3-bet call" and villain_position == "CO":
        if hero_position == "BU":
            return Range('99-22,AJs-A8s,A6s-A3s,KTs+,Q9s+,J9s+,T8s+,97s+,86s+,76s,65s,54s,AQo-ATo')
    #4-bet range
    elif action == "4-bet" and villain_position == "CO":
        if hero_position == "BU":
            return Range('TT+,AQs+,A2s,K5s,AKo,ATo-A9o')

@app.route('/')
def root():
    return render_template('index.html')

@app.route('/calculate',methods = ['POST', 'GET'])
def getOdds():
    villain_hand = None
    flop = [request.form['board1'], request.form['board2'], request.form['board3']]

    #Error handling
    if len(flop[0]) == 0:
        board = ['5d','6d','7d']
    else:
        board = flop
    turn = request.form['board4']
    river = request.form['board5']
    if len(turn) != 0:
        board.append(turn)
    if len(river) != 0:
        board.append(river)
    hero_hand = Combo( request.form['hero_hand'])
    action = request.form['action']
    villain_position = request.form['villain_position']
    hero_position =  request.form['hero_position']
    villain_range = getVillianRange(action, villain_position, hero_position)
    
    #Constant Variables
    do_exact_calculation = True
    verbose = True
    run_one_simulation = 1
    do_not_read_from_file = None

    items = [holdem_calc.calculate_odds_villan(board, do_exact_calculation, 
                                run_one_simulation, do_not_read_from_file , 
                                hero_hand, villain_hand, 
                                verbose, print_elapsed_time = False) for villain_hand in villain_range.combos]
    odds = {}
    [odds.update({odd_type: np.mean([res[0][odd_type] for res in items if res])}) for odd_type in ["tie", "win", "lose"]]
    #Odds as dictionary with tie, win, loss as keys
    #return str(odds.get("win"))
    response = app.response_class(
        response=json.dumps(odds),
        status=200,
        mimetype='application/json'
    )
    return response

if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. This
    # can be configured by adding an `entrypoint` to app.yaml.

    # Flask's development server will automatically serve static files in
    # the "static" directory. See:
    # http://flask.pocoo.org/docs/1.0/quickstart/#static-files. Once deployed,
    # App Engine itself will serve those files as configured in app.yaml.
    app.run(host='127.0.0.1', port=8080, debug=True)
