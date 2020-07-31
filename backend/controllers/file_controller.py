import os
from werkzeug.utils import secure_filename
import config
from flask_restful import Resource
from flask import request, abort


def allowed_file(filename):
    return ('.' in filename and
            filename.rsplit('.', 1)[1].lower() in config.ALLOWED_EXTENSIONS)


class File(Resource):
    def post(self):
        if 'file' not in request.files:
            abort(500)
        file = request.files['file']
        if file.filename == '':
            abort(500)
        if allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(config.UPLOAD_FOLDER, filename))
            return {'response': 'File uploaded successfully'}
