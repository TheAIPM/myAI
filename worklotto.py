# 11lotto.py
# list 예제 로또

import random
lotto = [] #빈 list 생성
# 해결1] 컴퓨터가 발생시키는 난수이용, 6회반복 추가 후, sort 정렬 #변수.sort
# 해결2] 난수 중복체크 if
# 예외사항 - 숫자중복발생가능. ㄱㅊ

print('🥀해결1')
for k in range(6) :
    com = random.randint(1,45)
    lotto.append(com)
lotto.sort()
print(lotto)

print('🥀해결2')
import random
lotto = []
# 1. 숫자가 딱 6개가 될 때까지 무한 반복!
while len(lotto) < 6:
    com = random.randint(1, 45)
    if com not in lotto: # <-- 중복문을 없애는...
        lotto.append(com)
    # 이미 있다면? 그냥 아무것도 안 하고 다시 위로 올라가서 뽑아요!
lotto.sort()
print(f"중복 없는 로또 번호: {lotto}")
print('😃😄감사합니다😄😃')

# 해결2]의 set을 이용한 답변도 있어 별첨합니다.
#import random
# lotto_set = set() # 빈 세트 생성

# while len(lotto_set) < 6:
#     com = random.randint(1, 45)
#     lotto_set.add(com) #appent == .add (set에서는 같이 쓴대요) 
# # 출력할 때는 정렬을 위해 리스트로 바꿔줍니다.
# lotto = list(lotto_set)
# lotto.sort()
# print(f"세트로 만든 로또 번호: {lotto}")