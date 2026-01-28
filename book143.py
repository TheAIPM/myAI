# book143.py
# dict딕셔너리 설명및 실습

lux = {
    'health' : 490,
    'mana' : 334,
    'melee' : 550,
    'armor' : [18.72, 24.96],
}
#print(lux['armor'])
# print(lux.keys()) #dict_keys(['health', 'mana', 'melee', 'armor'])
lux['health'] = 2037 #value데이터 수정
print(lux)
lux['spear'] = 1500 #신규등록 추가
print(lux)

if 'melee' in lux:
    print('존재하는 항목자원입니다')
else:
    print('없는 자원입니다')


# 파이썬 참고설명서
# https://docs.python.org/ko/3.14/tutorial/datastructures.html#dictionaries