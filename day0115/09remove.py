# 09remove.py
data = [5, 4, 7, 1, 9, 2]
data[1] = 316 #수정작업 
print(data) #[5, 316, 7, 1, 9, 2]

# 맨끝에서삭제 data.pop()
data = [5, 4, 7, 1, 9, 2]
data.pop()
print(data)  #[5, 4, 7, 1, 9]

data.remove(7) #위험한요소가 없는데이터 삭제처리하면 실행중에 에러 
print(data)  #[5, 4, 1, 9]

# 리스트 데이터등록, 추출, 삭제, 조회 

"""
리스트삭제연습
data = [5, 4, 7, 1, 9, 2]
data.pop()
print(data)  #[5, 4, 7, 1, 9]

data.remove(7) #위험한요소가 없는데이터 삭제처리하면 실행중에 에러 
print(data)  #[5, 4, 1, 9]
"""



