import os
from dotenv import load_dotenv
load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# 상수
STATION_FILE_PATH = os.path.join(BASE_DIR, 'data', '서울교통공사_역명 지하철역 검색.json')
CENTER_FILE_PATH = os.path.join(BASE_DIR, 'data', '서울시_유실물센터.json')

BASE_URL = "http://apis.data.go.kr/1320000/LosPtfundInfoInqireService" 
API_KEY = os.getenv("API_KEY")
SERVICE_1 = "getPtLosfundInfoAccToClAreaPd" # 오퍼레이터 1
SERVICE_2 = "getPtLosfundInfoAccTpNmCstdyPlace" # 오퍼레이터 2
SERVICE_3 = "getPtLosfundDetailInfo"  # 오퍼레이터 3

# 로컬 DB
LOCAL_DB_CONFIG = {
    'host': 'localhost',
    'user': os.getenv("LOCAL_DB_USER"),
    'password': os.getenv("LOCAL_DB_PASSWORD"),
    'database': os.getenv("LOCAL_DB_DATABASE")
}

# Railway DB
RAILWAY_DB_CONFIG = {
    'host': os.getenv("DB_HOST"),
    'user': os.getenv("DB_USER"),
    'password': os.getenv("DB_PASSWORD"),
    'database': os.getenv("DB_DATABASE"),
    'port': int(os.getenv("DB_PORT", 3306))
}