from django.db import models

# Create your models here.
class Books(models.Model):
  book_name = models.CharField(max_length=50)
  ISBN = models.IntegerField()
  publication = models.CharField(max_length=50)
  published_on = models.DateField()
  author = models.CharField(max_length=50)
  subject = models.CharField(max_length=50)
  copies = models.IntegerField()
  available_copies = models.IntegerField(default=0)
  class Meta:
    db_table='Books'

class Admin(models.Model):
  name = models.CharField(max_length=50)
  password = models.CharField(max_length=50)
  class Meta:
    db_table = "Admin"

class Client(models.Model):
  name = models.CharField(max_length=50)
  ph_no = models.IntegerField()
  email = models.EmailField(max_length=50)
  client_id = models.IntegerField()
  class Meta:
    db_table = "Client"

class Borrow(models.Model):
  client_id = models.IntegerField()
  book_id = models.IntegerField()
  borrow_date = models.DateField()
  return_date = models.DateField()
  class Meta:
    db_table = "Borrow"