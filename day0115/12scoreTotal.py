# 12scoreTotal.py
student = ['박이썬', 60,90,85 ]
name = ''
total, avg = 0,0

total = student[1]+student[2]+student[3] #표준정석
total = student[1:] #[60, 90, 85]
total = sum(student[1:]) 

print('이름 =', student[0])
print('총점 =', total)
print('평균 =', total//3)