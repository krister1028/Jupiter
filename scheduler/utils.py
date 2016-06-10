from datetime import datetime, timedelta
from dateutil.parser import parse


def parse_date_string(date_string):
    return parse(date_string).date()


def daterange(start_date, end_date):
    current_date = start_date
    dates = []
    if start_date > end_date:
        raise Exception('start date is before end date')
    while current_date.date() <= end_date.date():
        dates.append(current_date.date())
        current_date += timedelta(days=1)

    return dates