from flask import abort
import jwt


def add_user_information_to_request(request, secret_key):
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        abort(403, 'Bearer token is necessary for authorization')
    auth_token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(auth_token, secret_key)
        request.filenames = payload['filenames']
        request.username = payload['username']
    except:
        abort(403, 'Invalid token')


def authorize_access_to_file(request):
    path_parameters = request.view_args
    for path_parameter, value in path_parameters.items():
        if "filename" in path_parameter:
            if not hasattr(request, 'filenames') or value not in request.filenames:
                abort(403, f'You do not have access to file {value}')
