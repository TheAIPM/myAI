# 04tryexcept.py
num1 = 15
num2 = 0

hap,gob,mok,nmg = 0,0,0,0

try:
    hap = num1+num2
    gob = num1*num2
    mok = num1/num2
    nmg = num1%num2
except : 
    print('연산처리를 다시 확인하세요')



print(f'{num1} + {num2} = {hap}')
print(f'{num1} * {num2} = {hap}')
print(f'{num1} / {num2} = {hap}')

print()
print('열려라 green  수행~~')
print('열려라 blue 수행~~')
print('열려라 yellow 수행~~')
