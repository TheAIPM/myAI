# worklotto.py

import random

lotto = [ ]  
# 해결1] 컴퓨터가 발생해주는 난수를 이용해서 6개 로또 발생 추가후 sort정렬해서 출력 
# 해결2] 난수 중복체크 if  8교시 
for k in range(6):
    com = random.randint(1,45)
    lotto.append(com)

print(lotto)
