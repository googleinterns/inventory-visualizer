from datetime import datetime, timedelta
import jwt
from flask_restful import Resource
from flask import request
from functools import wraps
from middlewares.access_validator import add_user_information_to_request, authorize_access_to_file
from authentication.token_controller import TokenControllerSingleton
import config

def auth_decorator(function):
    @wraps(function)
    def authorize_access(*args, **kwargs):
        add_user_information_to_request(request, TokenControllerSingleton.get_secret_key())
        authorize_access_to_file(request)
        return function(*args, **kwargs)

    return authorize_access


def issue_token(username, filenames):
    payload = {
        'username': username,
        'filenames': filenames,
        'exp': datetime.utcnow() + timedelta(hours=config.token_validity_period)
    }
    jwt_token = jwt.encode(payload, TokenControllerSingleton.get_secret_key())
    return jwt_token


class ProtectedResource(Resource):
    method_decorators = [auth_decorator]


class Register(Resource):
    def post(self):
        jwt_token = issue_token(username=request.json['username'], filenames=[])
        return {'token': jwt_token.decode('utf-8')}
