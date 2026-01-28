# test.py

tel = {'jack':4098, 'sape':4139}
print(tel)
tel['guido'] = 4127
print(tel)
print(tel['jack'])
# 에러발생해서 아래코드 실행할수 없어서  print(tel['irv'])

if tel.get('irv') == None:
    print('irv없는 키값입니다')
else:
    print(tel['irv'])

del tel['sape'] #삭제
print(tel)
print()

tel['bc'] = 4127
print(tel)

list(tel)
print(sorted(tel))  #list소트 lotto.sort()











