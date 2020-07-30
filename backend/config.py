import os

port = 5002
perPage = 50
ALLOWED_EXTENSIONS = {'csv'}
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = ROOT_DIR + '/files'
