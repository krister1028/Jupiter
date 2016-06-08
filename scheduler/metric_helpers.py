from datetime import datetime
import pytz
from django.db.models import Min

import utils
from scheduler.models import Job


def get_default_start_end_dates(group, start_date_string=None, end_date_string=None):

    if start_date_string:
        start_date = utils.parse_date_string(start_date_string)
    else:
        start_date = Job.objects.filter(group=group).aggregate(Min('created'))['created__min'] or datetime.now(pytz.utc)

    if end_date_string:
        end_date = utils.parse_date_string(end_date_string)
    else:
        end_date = datetime.now(pytz.utc)

    return start_date, end_date