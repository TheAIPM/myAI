# 03string.py
url = 'www.google.com'
print('변경전', url)

# 해결1] 변경 replace(구,신변경)   google데이터를 Tmax
chanage = url.replace('google','Tmax')
print('변경후', chanage)

data = 'my best'
print(data.capitalize()) #첫글자만 대문자
print(data.upper()) #전체데이터가 대문자
print(data.lower()) #전체데이터가 소문자
print()

msg = '   it is a best python two sts    '  
print(msg)

ret = msg.replace(' ','') #itisabestpython
print(ret)

ret = msg.strip() #it is a best python 
print(ret)

# 해결2] msg문자열데이터에서 앞뒤 공백제거  replace(), strip()추천 lstrip() rstrip()
# 해결3] 특정문자열갯수 count()  전체문자열갯수 len(msg)
print('t문자갯수 =', msg.count('t'))
print('s문자갯수 =', msg.count('s'))
msg = '   it is a best python two sts    '  