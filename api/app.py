from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def sorting():
    return render_template('sorting.html')

@app.route('/graphs')
def graphs():
    return render_template('graphs.html')
