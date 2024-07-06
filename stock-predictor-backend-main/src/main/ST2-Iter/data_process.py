import json
import os
from datetime import datetime

import pandas as pd


def convert_date_format(date_str):
    date_str = str(date_str)
    return datetime.strptime(date_str, "%Y%m%d").strftime("%Y-%m-%d")


def convert_json_format(output_data):
    output = {'name': output_data['name'], 'datas': []}
    for close, date in zip(output_data['close'], output_data['date']):
        output['datas'].append({'close': close, 'date': date})

    return output


stock_dir = './stocks'
stock_names = os.listdir(stock_dir)
for stock_name in stock_names[1:]:
    df = pd.read_csv(os.path.join(stock_dir, stock_name))

    # 提取 close 字段
    close_data = df['close'].tolist()
    time_stamp = df['trade_date'].apply(convert_date_format).tolist()
    if time_stamp[0] == '2024-04-01':
        time_stamp = time_stamp[::-1]

    assert len(close_data) == len(time_stamp)
    # 创建字典并添加 close 字段和 name 字段
    output_data = {
        "close": close_data,
        "name": f'{stock_name[:-4]}',
        "date": time_stamp
    }

    out_put = convert_json_format(output_data)
    # 保存为 JSON 文件
    json_file_path = os.path.join('JSON', f'{stock_name[:-4]}-F.json')
    with open(json_file_path, 'w') as json_file:
        json.dump(out_put, json_file, indent=4)

    print(f"{stock_name[:-4]} Data has been saved to {json_file_path}")
