import config
from flask import abort


def validate_request(request):
    for filter, value in request.items():
        passed, message = rules[filter](value)
        if not passed:
            abort(400, filter + ' ' + message)

def numeric_rule(value):
    if value.isdigit():
        return True, ''
    return False, 'value should be a number'


def string_rule(value):
    if value.isalpha():
        return True, ''
    return False, 'value should contains letters only'


def time_period_rule(value):
    if value in config.allowed_time_periods:
        return True, ''
    return False, 'value should be an allowed time period'

rules = {
    'page': numeric_rule,
    'per_page': numeric_rule,
    'time_period': time_period_rule,
    'country': string_rule,
    'device': string_rule,
    'start_date': numeric_rule,
    'end_date': numeric_rule
}
