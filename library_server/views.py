from django.shortcuts import render
from django.http import HttpResponse
from .models import Books,Client,Admin,Borrow
from django.core import serializers
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.http import JsonResponse
import json
    
# Create your views here.
def home(request):
  return render(request,'home/index.html')

def add_book(request):
  if(request.method=='POST'):
    post_data = json.loads(request.body.decode("utf-8"))
    save_data = Books(**post_data)
    save_data.available_copies = post_data['copies']
    save_data.save()
    post_data['id'] = (save_data.id)
    return HttpResponse(json.dumps(post_data))
  else:
    return render(request,'add-book/index.html')

def search_book(request):
  if(request.method=='POST'):
    query = json.loads(request.body.decode("utf-8"))
    if(query['query'] == 'all'):
      data = serializers.serialize('json', Books.objects.all())
    elif(query['query'] == 'borrowable'):
      data = serializers.serialize('json', Books.objects.filter(copies__gt=0))
    else:
      data = '{}'
    return HttpResponse(data);
  else:
    return render(request,'search-book/index.html')

def add_client(request):
  if(request.method=='POST'):
    post_data = json.loads(request.body.decode("utf-8"))
    save_data = Client(**post_data)
    save_data.save()
    post_data['id'] = (save_data.id)
    return HttpResponse(json.dumps(post_data))
  else:
    return render(request,'add-client/index.html')

def add_admin(request):
  if(request.method=='POST'):
    post_data = json.loads(request.body.decode("utf-8"))
    save_data = Admin(**post_data)
    save_data.save()
    post_data['id'] = (save_data.id)
    return HttpResponse(json.dumps(post_data))
  else:
    return render(request,'add-admin/index.html')

def borrow_book(request):
  if(request.method=='POST'):
    post_data = json.loads(request.body.decode("utf-8"))
    if(Client.objects.filter(name=post_data['name'],id=post_data['client_id']).exists()):
      book_update = Books.objects.filter(id=post_data['book_id'])
      if (book_update[0].available_copies>0):
        save_borrow = Borrow()
        save_borrow.book_id = post_data['book_id']
        save_borrow.client_id = post_data['client_id']
        save_borrow.borrow_date = post_data['borrow_date']
        save_borrow.return_date = post_data['return_date']
        save_borrow.save()
        post_data['is_client'] = True
        post_data['id'] = save_borrow.id
        post_data['error'] = 'no error occured'
        book_update.update(available_copies = (book_update[0].available_copies - 1))
      else:
        post_data['is_client'] = True
        post_data['error'] = 'book copy is no longer available'
    else:
      post_data['is_client'] = False
      post_data['error'] = 'you are not a client'
      post_data['id'] = -1
    return HttpResponse(json.dumps(post_data))
  else:
    return render(request,'borrow-book/index.html')

def admin_pannel(request):
  if(request.method=='POST'):
    post_data = json.loads(request.body.decode("utf-8"))
    if(post_data['password'] == 'library_manager-2003' and Admin.objects.filter(name = post_data['name'],password = post_data['password'])):
      post_data['verified'] = True
      return HttpResponse(json.dumps(post_data))
    else:
      post_data['verified'] = False
    return HttpResponse(json.dumps(post_data))
  else:
    return HttpResponse('admin-pannel only POST request is accepted.')  
# only post authentication no frontend added
# @csrf_exempt
def auth_admin(request):
  if(request.method=='POST'):
    post_data = json.loads(request.body.decode("utf-8"))
    if(post_data['password'] == 'library_manager-2003'):
      post_data['verified'] = True
      return HttpResponse(json.dumps(post_data))
    else:
      post_data['verified'] = False
    return HttpResponse(json.dumps(post_data))
  else:
    return HttpResponse('only POST request is accepted.')

def client_page(request):
  if(request.method=='POST'):
    post_data = json.loads(request.body.decode("utf-8"))
    if(Client.objects.filter(**post_data).exists()):
      post_data['verified'] = True
      borrow_list = list()
      for i in Borrow.objects.filter(client_id=post_data['id']):
        borrow_list.append(Books.objects.filter(id=i.book_id)[0])
      post_data['borrow_data'] = serializers.serialize('json', borrow_list)
      print(post_data['borrow_data'])
      return HttpResponse(json.dumps(post_data))
    else:
      post_data['verified'] = False
    return HttpResponse(json.dumps(post_data))
  else:
    return render(request,'client-page/index.html')

def fine_submit(request):
  if(request.method=='POST'):
    post_data = json.loads(request.body.decode("utf-8"))
    print(post_data)
    if(post_data['password'] == 'library_manager-2003'):
      post_data['verified'] = True
      if(Borrow.objects.filter(id=int(post_data['id'])).exists()):
        Borrow.objects.filter(id=int(post_data['id'])).delete()
      return HttpResponse(json.dumps(post_data))
    else:
      post_data['verified'] = False
    return HttpResponse(json.dumps(post_data))
  else:
    return HttpResponse('hello only POST request is accepted.')

def admin_page(request):
  if(request.method=='POST'):
    post_data = json.loads(request.body.decode("utf-8"))
    if (Admin.objects.filter(**post_data).exists()):
      post_data['verified'] = True
      post_data['Books'] = serializers.serialize('json', Books.objects.all())
      post_data['Client'] = serializers.serialize('json', Client.objects.all())
      post_data['Borrow'] = serializers.serialize('json', Borrow.objects.all())
    else:
      post_data['verified'] = False
    return HttpResponse(json.dumps(post_data))
  else:
    return render(request,'admin-page/index.html')

def return_book(request):
  if(request.method == 'POST'):
    post_data = json.loads(request.body.decode("utf-8"))
    borrow_data = {"client_id":int(post_data['client_id']),"book_id":int(post_data['book_id']),"borrow_date":post_data['borrow_date'],"id":int(post_data['id'])}
    # print(json.dumps( borrow_data))
    if(Client.objects.filter(id=post_data['client_id'],client_id=post_data['password']).exists() and Borrow.objects.filter(id=borrow_data['id'],borrow_date = borrow_data['borrow_date'],client_id = borrow_data['client_id']).exists()):
      post_data['verified'] = True
      post_data['borrow_data'] = serializers.serialize('json', Borrow.objects.filter(id=borrow_data['id']))
      # print(post_data['borrow_data'],'ln 133\n')
      return HttpResponse(json.dumps(post_data))
    else:
      post_data['verified'] = False
    return HttpResponse(json.dumps(post_data))
  else:  
    return render(request,'return-book/index.html')