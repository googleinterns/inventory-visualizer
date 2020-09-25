import os
from classifiers import error_significance_classifier

port = 5002
per_page = 50
ALLOWED_EXTENSIONS = {'csv'}
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = ROOT_DIR + '/files'
SECRET_KEY_FILE = ROOT_DIR + '/key/secret.txt'
time_period = 'week'
allowed_time_periods = ['day', 'week', 'month']
days_with_error_significance = 730
error_significance_by_time_period = {
    'day': days_with_error_significance,
    'week': int(days_with_error_significance / 7),
    'month': int(days_with_error_significance / 30),
}
error_significance_function = error_significance_classifier.get_error_significance_score
secret_key_length = 15
token_validity_period = 24 * 7 * 2  # 2 weeks
error_order_by = 'error_significance'
order_by = 'unordered'
allowed_order_types = ['error_significance', 'alphabetical', 'country_significance']