# 08list.py
data = [5, 4, 7, 1, 9, 2]
print(data)
# 전체내용삭제1] data.clear() #내용전체지우기 - 위험한 명령어 
print('전체삭제1 data.clear()')
print(data)

# 부분삭제2]  [시작:끝-1] = []
print('부분삭제2 data[2:5] = []')
data = [5, 4, 7, 1, 9, 2]
data[2:5] = []
print(data) #[5, 4, 2]

# 부분삭제3]  del data[2]
print('부분삭제3 del data[2]')
data = [5, 4, 7, 1, 9, 2]
del data[2:5]
print(data)  # 7데이터만삭제 

# 무조건뒤에서삭제4] data.pop()
data = [5, 4, 7, 1, 9, 2]
data.pop()
print(data) 


"""
data = [5, 4, 7, 1, 9, 2]
print('정렬전' ,data) 

data.sort()
print('정렬후' ,data)  
print('합계 =', sum(data))
"""




