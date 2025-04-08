from django.db import models
from utilities import uuidv7
from utilities.querysets import RestrictedQuerySet


class BaseModel(models.Model):
    id = models.UUIDField(
        primary_key=True, default=uuidv7.uuid7(), unique=True, editable=False
    )
    objects = RestrictedQuerySet.as_manager()

    @property
    def present_in_database(self):
        """
        True if the record exists in the database, False if it does not.
        """
        return not self._state.adding

    class Meta:
        abstract = True
