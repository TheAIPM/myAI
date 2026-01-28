# 07input.py
a,b,total = 0,0,0

try:
    a = int(input('첫번째숫자 a입력하세요'))
    b = int(input('두번째숫자 b입력하세요'))
except:
    print('삐~익 처리중에 오류가 발생했습니다\n다시 순서대로 처리하세요')
else:
    total = a + b
    print(a,'+',b,'=',total)
    print('{} + {} = {}'.format(a,b,total))
    print(f'{a} + {b} = {total}')


