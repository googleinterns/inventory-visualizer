import os
from werkzeug.utils import secure_filename
import config


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in config.ALLOWED_EXTENSIONS


def post(request):
    if 'file' not in request.files:
        return 'no file in request', 500, ''
    file = request.files['file']
    if file.filename == '':
        return 'no selected file', 500, ''
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(config.UPLOAD_FOLDER, filename))
        return 'File uploaded successfully', 200, filename
