import random
import string
import config


class TokenControllerSingleton:
    secret_key = None

    @staticmethod
    def get_secret_key():
        if TokenControllerSingleton.secret_key is None:
            TokenControllerSingleton()
        return TokenControllerSingleton.secret_key

    def generate_secret_key(self):
        letters_and_digits = string.ascii_letters + string.digits
        return ''.join((random.choice(letters_and_digits) for i in range(config.secret_key_length)))

    def __init__(self):
        if TokenControllerSingleton.secret_key is None:
            TokenControllerSingleton.secret_key = self.generate_secret_key()
