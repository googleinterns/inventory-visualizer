from flask import Flask
from flask_restful import Api
from controllers import file_controller, data_controller
from flask_cors import CORS
import config

app = Flask(__name__)
api = Api(app)
CORS(app)

api.add_resource(data_controller.Data, '/data/<filename>')
api.add_resource(file_controller.File, '/file', )
if __name__ == '__main__':
    app.run(port=config.port)
