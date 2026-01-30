# 04jumin.py

jumin = '960724-1528946' 
# 해결1] 성별 남자/여자 문자열시작 index 0번째 시작 
# 해결2] len()길이체크하는 함수 이용해서 앞자릿수 6, 뒷자리수 7   
# 해결3] 생일가져오기 당신의 생일은 07월24일입니다  추출접근index[시작 : 끝+1]
# 해결4] 나이계산 import time에서 제공하는 my=time.localtime()  my.tm_year이용
jum1 = jumin.split('-') #list리스트화 효율성 좋음
print(jum1[0])      #960724
print(jumin[0:6])   #960724
print()
print(jum1[1])     #1528946
print(jumin[7:])   #1528946
print()

# jum2 = jumin.split() #list리스트화 ['960724-1528946'] 효율성빵점
# print(jum2)