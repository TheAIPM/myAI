# 09time.py

import time

print('시스템 날짜및 시간확인 ')
print(time.localtime())
time.sleep(1)

my = time.localtime()
print('현재년도', my.tm_year)