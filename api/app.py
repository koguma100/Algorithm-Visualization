import os
from flask import Flask, render_template

app = Flask(
    __name__, 
    template_folder=os.path.join(os.path.dirname(__file__), 'templates')
)

@app.route('/')
def sorting():
    return render_template('sorting.html')

@app.route('/graphs')
def graphs():
    return render_template('graphs.html')