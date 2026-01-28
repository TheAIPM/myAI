# 10dict.py
# 딕트이름 = {key키 : value값, key키 : value값}
# 딕트이름 = {key키 : (1,2,3,4), key키 : (6,7,8,9), key키 : ('a','b','c','d') }
# myWebsite  = {}
# myAppsite  = dict()
# mysite  = {'naver':'www.green', 'kakao':'www.kakako', 'google':'www.google.com'}

mysite = { } 
# mysite[키] = value 값대입
mysite['naver'] = 'http://www.green.com'
mysite['kakao'] = 'http://www.kakao.net'
mysite['google'] = 'http://www.google.org'
mysite['naver'] = 'http://www.donga'
print(mysite)

mysocre = dict()
mysocre['name'] = 'kim'
mysocre['kor'] = 90
mysocre['eng'] = 85
mysocre['kor'] = 74 #kor동일하면 에러발생할까? 동일한키가 발생될까요? 덮어씌어지면서 값대입
# print(mysocre)

















