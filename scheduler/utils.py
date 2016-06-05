from datetime import datetime, timedelta


def parse_date_string(date_string):
    return datetime.strptime(date_string[4].partition('T')[0], '%Y-%m-%d').date()


def daterange(start_date, end_date):
    for n in range(int ((end_date - start_date).days) + 1):
        yield start_date + timedelta(n)


def get_history_status_as_of(history_records, date):
    pass