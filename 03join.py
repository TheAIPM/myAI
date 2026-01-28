# 02join.py
url = 'www.google.com'
print(url)

mylist1 = url.split()
print(mylist1) #['www.google.com'] 리스트화

mylist2 = url.split('.') 
mylist2 = 'www.google.com'.split('.') 
print(mylist2) #['www', 'google', 'com'] 리스트화

url='xyz'
space = ','
print(space.join(url))
print(','.join(url))

