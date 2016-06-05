from django.core.management import BaseCommand

from scheduler.management.jobs.set_up_group import onboard_group


class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument('group_name', type=str)

    def handle(self, *args, **options):
        onboard_group(options['group_name'])
