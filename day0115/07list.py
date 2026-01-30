# 07list.py
data = [5,7,1]
print(data)

# 해결1] 맨끝에 항목추가 append(9)
data.append(9) 
data.append(2) 
print(data) #[5, 7, 1, 9, 2]

# 해결2] 중간에 데이터추가삽입 insert(위치, 데이터값)
data.insert(1,4)
print(data) #[5, 4, 7, 1, 9, 2]

# result = data.index(7)
# print('7숫자위치 =',result) #7숫자위치 = 2
data.sort()
print(data)  #[1, 2, 4, 5, 7, 9]
data.reverse()
print(data)  #[9, 7, 5, 4, 2, 1]

print('합계 =', sum(data))







