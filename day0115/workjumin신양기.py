# workjumin.py

# 해결1] 성별 남자/여자 문자열시작 index 0번째 시작 
# 해결2] len()길이체크하는 함수 이용해서 앞자릿수 6, 뒷자리수 7   
# 해결3] 생일가져오기 당신의 생일은 07월24일입니다  추출접근index[시작 : 끝+1]
# 해결4] 나이계산 import time에서 제공하는 my=time.localtime()  my.tm_year이용
# 해결5] 960724-1******  개인정보보호


import time

#주민번호 입력 + 검증
while True:
    front = input("주민등록번호 앞자리를 입력하세요(6자리):")
    back = input("주민번등록번호 뒷자리를 입력하세요(7자리):")

#숫자 여부 검증
    if not (front.isdigit() and back.isdigit()):
        print("숫자만 입력해야 합니다.\n")
        continue

#길이 검증[해결2]
    if len(front) != 6 or len(back) !=7:
        print("앞자리는 6자리, 뒷자리는 7자리여야 합니다\n")
        continue

#성별 코드 검증[해결1]
    if back[0] not in ["1","2","3","4"]:
        print("뒷자리 첫 숫자는1~4만 가능합니다.\n")

#모든 검증 통과 -> 반복종료
    break

# ----------------
# 성별 판별
gender_code = back[0]
if gender_code in ["1","3"]:
    gender = "남자"
else:
    gender = "여자"

#------------------
#생일 추출[해결3]
year = front[0:2]
month = front[2:4]
day = front[4:6]

#------------------
#나이 계산[해결4]
now = time.localtime()
current_year = now.tm_year

if gender_code in ["1","2"]:
    birth_year = 1900 + int(year)
else :
    birth_year = 2000 + int(year)

age = current_year - birth_year + 1 #한국식 나이

#------------------
#주민등록번호 마스킹 출력[해결5]

masked_back = ""

for i in range(len(back)):
    if i ==0:
        masked_back += back[i]
    else:
        masked_back += "*"

#----------------
#최종출력
print("-"*15)
print(f"성별:{gender}")
print(f"나이:{age}세")
print(f"당신의 생일은 {month}월 {day}일입니다")
print("주민등록번호:",front,"-",masked_back)
