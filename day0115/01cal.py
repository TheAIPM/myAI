# 01cal.py
# print()다양하게 출력
a,b,total = 7,5,0
total = a+b
#print('합계=',total) 7+5 =12출력
print(a, '+',b, '=', total)
print('%d + %d = %d'%(a,b,total))
print('{} + {} = {}'.format(a,b,total))
print('{a} +{b}={total}')
#[대괄호] {중괄호} (소괄호)
print(f'{a}+{5} = {total}')