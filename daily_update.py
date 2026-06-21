from datetime import datetime, timedelta
from utils import *
from constants import *

def run_daily():
    stations = load_location_data(STATION_FILE_PATH, 'station_nm')
    centers = load_location_data(CENTER_FILE_PATH, 'center_nm')
    all_location = sorted(list(stations | centers))
    
    two_days_ago = (datetime.now() - timedelta(days=2)).strftime('%Y%m%d')
    today = datetime.now().strftime('%Y%m%d')
    print(f"최근 데이터 수집 시작 ({two_days_ago}~어제)",  )
    data = fetch_lost_item(list(all_location), start_date=two_days_ago)
    item = fetch_details(data)
    
    if item:
        save_to_db(item, LOCAL_DB_CONFIG)
        save_to_db(item, RAILWAY_DB_CONFIG)
        print(f"수집 완료: {len(data)}건 처리됨")


if __name__ == "__main__":
    run_daily()
    delete_old_data(LOCAL_DB_CONFIG)
    delete_old_data(RAILWAY_DB_CONFIG)