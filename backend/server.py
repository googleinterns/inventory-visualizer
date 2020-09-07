from controllers import file_controller, data_controller, error_controller
import config
from flask import Flask, request
from flask_restful import Api
from flask_cors import CORS
from middlewares import request_filter_validator
from authentication import auth

app = Flask(__name__)
api = Api(app)
CORS(app)


@app.before_request
def middleware():
    request_filter_validator.validate_request(request.args)


api.add_resource(data_controller.Data, '/data/<filename>')
api.add_resource(error_controller.Error, '/error/<filename1>/<filename2>')
api.add_resource(file_controller.File, '/file', )
api.add_resource(error_controller.Comparator, '/compare/<original_filename>/<filename_for_comparison>')
api.add_resource(auth.Register, '/register')

if __name__ == '__main__':
    app.run(port=config.port)
