# 11lotto.py

import random

lotto = [ ]  #로또리스트
# 해결1] 컴퓨터가 발생해주는 난수를 이용해서 6개 로또 발생 추가후 sort정렬해서 출력 
for k in range(6):
    com = random.randint(1,45)
    lotto.append(com)

print(lotto)


# my = int(input('로또숫자1~45사이 입력'))
# print(my)