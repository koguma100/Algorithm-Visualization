import os
from flask import Flask, render_template

app = Flask(
    __name__, 
    template_folder='templates',
    static_folder='assets',
)

@app.route('/')
def sorting():
    return render_template('sorting.html')

@app.route('/graphs')
def graphs():
    return render_template('graphs.html')

@app.route('/trees')
def trees():
    return render_template('trees.html')

@app.route('/about')
def about():
    return render_template('about.html')