import os
from flask import Flask, render_template

app = Flask(
    __name__, 
    template_folder='templates',
    static_folder='static'
)

@app.route('/')
def sorting():
    return render_template('sorting.html')

@app.route('/graphs')
def graphs():
    return render_template('graphs.html')

import os

@app.route('/load-file')
def load_file():
    template_dir = app.template_folder
    response = f"<b>Template folder:</b> {template_dir}<br><br>"

    try:
        if not os.path.exists(template_dir):
            return response + "<b>Error:</b> Template folder does not exist."

        files = os.listdir(template_dir)
        response += f"<b>Files in templates/:</b> {files}<br><br>"

        file_path = os.path.join(template_dir, 'sorting.html')

        if not os.path.isfile(file_path):
            return response + "<b>Error:</b> sorting.html not found in templates folder."

        with open(file_path, 'r') as f:
            content = f.read()

        response += "<b>Contents of sorting.html:</b><br><pre>" + content + "</pre>"
        return response

    except Exception as e:
        return response + f"<b>Error loading template file:</b> {e}"