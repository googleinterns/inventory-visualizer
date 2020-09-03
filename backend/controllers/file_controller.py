import os
from werkzeug.utils import secure_filename
import config
from flask import request, abort
from authentication.auth import issue_token
from authentication.auth import ProtectedResource
import time


def allowed_file(filename):
    return ('.' in filename and
            filename.rsplit('.', 1)[1].lower() in config.ALLOWED_EXTENSIONS)


class File(ProtectedResource):
    def post(self):
        if 'uploaded_data' not in request.files:
            abort(400, 'Uploaded_data is required for the request')
        file = request.files['uploaded_data']
        if file.filename == '':
            abort(400, 'Filename cannot be empty')
        if allowed_file(file.filename):
            filename = secure_filename(request.username + str(int(time.time())))
            file.save(os.path.join(config.UPLOAD_FOLDER, filename))
            user_files = request.filenames
            user_files.append(filename)
            jwt_token = issue_token(request.username, user_files)
            return {
                'response': 'File uploaded successfully',
                'token': jwt_token.decode('utf-8'),
                'filename': filename
            }
        else:
            abort(415, 'File type is not supported')

    def delete(self):
        filename = secure_filename(request.args.get('filename'))
        os.remove(os.path.join(config.UPLOAD_FOLDER, filename))
        return {'response': 'File deleted successfully'}
