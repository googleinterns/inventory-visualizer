from flask import Flask, request
from flask_restful import Resource, Api
from controllers import file_controller
from flask_cors import CORS

app = Flask(__name__)
api = Api(app)
CORS(app)


@app.route("/")
class File(Resource):
    def post(self):
        response, response_code = file_controller.post(request)
        return app.response_class(
            response=response,
            status=response_code,
            mimetype='application/json'
        )


api.add_resource(File, '/upload_file', )
if __name__ == '__main__':
    app.run(port=5002)
