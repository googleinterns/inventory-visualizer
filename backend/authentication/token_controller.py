import random
import string
import config
import os


class TokenControllerSingleton:
    secret_key = None

    @staticmethod
    def get_secret_key():
        if TokenControllerSingleton.secret_key is None:
            TokenControllerSingleton()
        return TokenControllerSingleton.secret_key

    def get_server_secret_key(self):
        with open(config.SECRET_KEY_FILE) as file:
            key = file.read()
        return key

    def secret_key_exists(self):
        return os.path.isfile(config.SECRET_KEY_FILE) and os.stat(config.SECRET_KEY_FILE).st_size != 0

    def generate_secret_key(self):
        letters_and_digits = string.ascii_letters + string.digits
        key = ''.join((random.choice(letters_and_digits) for i in range(config.secret_key_length)))
        with open(config.SECRET_KEY_FILE, 'w+') as file:
            file.write(key)
        return key

    def __init__(self):
        if TokenControllerSingleton.secret_key is None:
            if self.secret_key_exists():
                TokenControllerSingleton.secret_key = self.get_server_secret_key()
            else:
                TokenControllerSingleton.secret_key = self.generate_secret_key()
