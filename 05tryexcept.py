# 05tryexcept.py
num1 = 7
num2 = 0

hap,mok = 0,0

try:
    hap = num1+num2
    mok = num1/num2
except Exception as ex :
    print('에러:', ex)

print(f'{num1} + {num2} = {hap}')
print(f'{num1} / {num2} = {mok}')
print('열려라 참깨  수행~~')

