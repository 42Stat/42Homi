### .env

```
# 42 API

# For common usage, 1 sec per request.
# However Because of 42 API's instability, add delay(ex. 1.2)
DELAY_SEC_PER_REQUEST=

# API Application count(need to fill uid & secret in .42app.env)
API_APP_COUNT=

# If request failed, retry until max retry count
MAX_RETRY_COUNT_PER_REQUEST=

# Page size for pagination
PAGE_SIZE=

# 42 Campus ID(Seoul: 29)
CAMPUS_ID=

# When request doesn't have specified range, use this value
# Try to get count of data and find end of the range in every loop.
# This value is used with API_APP_COUNT(API_APP_COUNT * REQUEST_COUNT_PER_LOOP)
# 동시에 보낼 수 있는 갯수보다 1시간에 1,200개 밖에 못 보낸다는 사실이 더 중요하기 때문에,
# 아래 갯수를 줄여서 한번에 적은 요청을 보내면 빈 요청 횟수를 줄일 수 있다.
REQUEST_COUNT_PER_APP=

```

### .42app.env

```
# 42 API applications uid
UID_0=
UID_1=
UID_2=
UID_3=
UID_4=
UID_5=
UID_6=
UID_7=
UID_8=

# 42 API applications secret
SECRET_0=
SECRET_1=
SECRET_2=
SECRET_3=
SECRET_4=
SECRET_5=
SECRET_6=
SECRET_7=
SECRET_8=

# Request limit per hour(default: 1,200)
REQUEST_LIMIT_PER_HOUR_0=
REQUEST_LIMIT_PER_HOUR_1=
REQUEST_LIMIT_PER_HOUR_2=
REQUEST_LIMIT_PER_HOUR_3=
REQUEST_LIMIT_PER_HOUR_4=
REQUEST_LIMIT_PER_HOUR_5=
REQUEST_LIMIT_PER_HOUR_6=
REQUEST_LIMIT_PER_HOUR_7=
REQUEST_LIMIT_PER_HOUR_8=

# Request limit per second(default: 2)
REQUEST_LIMIT_PER_SEC_0=
REQUEST_LIMIT_PER_SEC_1=
REQUEST_LIMIT_PER_SEC_2=
REQUEST_LIMIT_PER_SEC_3=
REQUEST_LIMIT_PER_SEC_4=
REQUEST_LIMIT_PER_SEC_5=
REQUEST_LIMIT_PER_SEC_6=
REQUEST_LIMIT_PER_SEC_7=
REQUEST_LIMIT_PER_SEC_8=

```
