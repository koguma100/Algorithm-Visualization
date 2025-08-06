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

@app.route('/debug')
def debug():
    template_path = os.path.join(app.template_folder, 'sorting.html')
    exists = os.path.isfile(template_path)
    return f"Template folder: {app.template_folder} <br> sorting.html exists: {exists}"