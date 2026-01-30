# 05cal.py
a,b,total = 7,5,0
total = a+b
print(a,'+',b,'=',total)
print('%d + %d = %d'%(a,b,total))

mypattern = '{} + {} = {}'
print(mypattern.format(a,b,total))
print(f'{a} + {b} = {total}')


