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

from poker.hand import Combo

import holdem_calc
import holdem_functions

from flask import Flask, render_template, redirect, url_for, request

app = Flask(__name__)

@app.route('/')
def root():
    return render_template('index.html')

@app.route('/cards',methods = ['POST', 'GET'])
def getCard():
   if request.method == 'POST':
      user = request.form['nm']
      return redirect(url_for('success',name = user))
   else:
        #user = request.args.get('nm')
        board = ["Qc", "Th", "9s"]
        villan_hand = None
        exact_calculation = True
        verbose = True
        num_sims = 1
        read_from_file = None

        hero_hand = Combo('KsJc')

        odds = holdem_calc.calculate_odds_villan(board, exact_calculation, 
                            num_sims, read_from_file , 
                            hero_hand, villan_hand, 
                            verbose, print_elapsed_time = True)
        print("Another test")
        print(odds[0].get("win"))
        return (str(odds[0].get("win")))

if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. This
    # can be configured by adding an `entrypoint` to app.yaml.

    # Flask's development server will automatically serve static files in
    # the "static" directory. See:
    # http://flask.pocoo.org/docs/1.0/quickstart/#static-files. Once deployed,
    # App Engine itself will serve those files as configured in app.yaml.
    app.run(host='127.0.0.1', port=8080, debug=True)
