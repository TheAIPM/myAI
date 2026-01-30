# 13listsearch.py
fruits = ['blue', 'orange', 'cherry']
search = input('검색 대상 데이터입력 ')

if search  in fruits :
    print(f'빙고 {search} 데이터가 있습니다') 
    print(search in fruits ) #주석하면 더 좋아요 있으면 True
else:
    print(f'{search} 검색데이터 없습니다')
    print(search in fruits ) #주석하면 더 좋아요  없으면 False









"""
고전적인 방법의 검색 데이터양 최소
fruits = ['blue', 'orange', 'cherry']
search = input('검색 대상 데이터입력 ')

if search == fruits[0] :
    print('o빙고 블루 검색이 있네요')
elif search == fruits[1] :
    print('o빙고 오렌지 검색이 있네요')
elif search == fruits[2] :
    print('o빙고 체리 검색이 있네요')
else:
    print('검색데이터 없습니다')
"""