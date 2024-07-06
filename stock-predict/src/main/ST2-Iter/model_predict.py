import json
import os
import sys
from datetime import timedelta, datetime

import numpy as np
import torch
from sklearn.preprocessing import MinMaxScaler

from LSTM_Model import StockLSTM
from LSTM_Predictor import make_a_prediction
from LSTM_Trainer import train_user_model

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


def convert_json(json_file):
    data = json_file
    output = {'name': data['name'], 'datas': [], 'start_date': data['start_date']}
    for close, date in zip(data['close'], data['date']):
        output['datas'].append({'close': close, 'date': date})

    return output


def main(json_file_path):
    # 读取 JSON 文件
    with open(json_file_path, 'r') as f:
        data = json.load(f)
        stock_name = data['name']
        stocks = data['datas']
        predict_days = data['n_predictions']
        stock_value = [item['close'] for item in stocks]
        stock_date = [item['date'] for item in stocks]
        begin_date = stock_date[-1]

    param_file_names = os.listdir('./src/main/ST2-Iter/model')
    for param_file_name in param_file_names:
        if stock_name in param_file_name:
            matching_file = param_file_name
            break

    scaler = MinMaxScaler()
    time_series = scaler.fit_transform(np.array(stock_value).reshape(-1, 1))
    time_series = time_series.reshape(-1)

    if not matching_file:
        train_user_model(time_series)
    else:
        model = StockLSTM(input_size=32, hidden_size=32, num_layers=8, ).to(device)
        param_dir = os.path.join('./src/main/ST2-Iter/model', matching_file)
        model.load_state_dict(torch.load(param_dir))
        model.eval()

    time_step = 32  # Don't touch
    pred_time_series_norm = make_a_prediction(time_series, predict_days, time_step, model, is_visualize=False,
                                              device=device)
    pred_time_series_ = scaler.inverse_transform(np.array(pred_time_series_norm).reshape(-1, 1)).reshape(-1).tolist()
    pred_time_series = [round(item, 2) for item in pred_time_series_]

    for i in range(0, predict_days):
        pred_stock_date = (datetime.strptime(stock_date[len(stock_date) - 1], "%Y-%m-%d") + timedelta(days=1)).strftime(
            "%Y-%m-%d")
        stock_date.append(pred_stock_date)

    assert len(pred_time_series) == len(stock_date)

    output_data = {
        "close": pred_time_series,
        "name": f'{stock_name}',
        "date": stock_date,
        "start_date": begin_date
    }

    out_put = convert_json(output_data)
    # print(out_put)
    try:
        with open(os.path.join('./src/main/jsonfile', 'predict.json'), 'w') as json_file:
            json.dump(out_put, json_file, indent=4)
        print('Successfully...')
        return 0
    except:
        return -1


if __name__ == "__main__":
    json_file_path = sys.argv[1]
    print(json_file_path)
    re = main(json_file_path)
    if re == 0:
        pass
    else:
        print('Error')
