import os
from classifiers import error_significance_classifier

port = 5002
per_page = 50
ALLOWED_EXTENSIONS = {'csv'}
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = ROOT_DIR + '/files'
time_period = 'day'
allowed_time_periods = ['day', 'week', 'month']
days_with_error_significance = 730
error_significance_by_time_period = {
    'day' : days_with_error_significance,
    'week'  : days_with_error_significance / 7,
    'month'  : days_with_error_significance / 30,
}
error_significance_function = error_significance_classifier.get_error_significance_score
