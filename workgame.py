# workgame.py

#해결1] import random
#해결2] com = 정수발생(1,100)   74숫자난수발생
#해결3] 반복문 while권장
#해결4] 키보드 my=input('숫자입력(Q/q종료)')  39
 #      if my =='Q' or my =='q' : break기술
 #      num = int(my) 숫자 num = 39
 #      39숫자보다 큰수입니다    
 #      81숫자보다 작은수입니다   
#해결5] 적용/안적용 try~except 각자 
#해결6] 5회맞추기  각자 알아서 패스
# 파이썬언어 난수를 발생해서 사용자입력 숫자 updown 소스 만들어줘  

import random

#해결 1,2 : 난수 발생

come = random.randint(1,100)
count = 0 #시도 횟수

while True: # 해결 3: while 반복문
    if count == 5:
        print("5회 도전 실패! 정답은", come, "입니다")
        break
    
    my = input("숫자입력 (Q/q 종료): ")

    #해결 4: 종료조건
    if my == 'Q' or my == 'q':
        print("게임을 종료합니다")
        break
    
    try: #해결 5: 예외 처리
              num = int(my)
    except ValueError:
              print('숫자만 입력하세요')
              continue
    
       count +=1

              if num > come:
               print(num,"숫자보다 작은 수입니다.")
              elif num < come:
               print(num, "숫자보다 큰수 입니다")
              else:
               print("정답입니다",count,"번 만에 맞췄습니다.")
              break