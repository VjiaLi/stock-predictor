import os

import numpy as np
import pandas as pd
import torch
import torch.nn as nn
from sklearn import preprocessing
from torch.utils.data import DataLoader

from Dataset import SerialDataset
from LSTM_Model import StockLSTM
from LSTM_Predictor import make_a_prediction

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

batch_size = 8  # Don't touch
epochs = 15  # You may touch this
time_step = 12  # Don't touch
learning_rate = 0.001  # Don't touch
target_mean_len = 1  # Don't touch

lstm = StockLSTM(input_size=12, hidden_size=32, num_layers=4, ).to(device)


def main():
    # df = pd.read_csv('data.csv')
    # time_series = df['Passengers'].to_numpy()
    stock_dir = './stocks'
    stock_names = os.listdir(stock_dir)
    for stock_name in stock_names[1:]:
        df = pd.read_csv(os.path.join(stock_dir, stock_name))
        time_series = df['close']
        # input !!!
        print(f'{len(time_series)=}')
        print(time_series)

        scaler = preprocessing.MinMaxScaler()
        time_series = scaler.fit_transform(np.array(time_series).reshape(-1, 1))
        time_series = time_series.reshape(-1)
        time_series_train = time_series

        sin_train_serial_dataset = SerialDataset(time_series_train, time_step=time_step,
                                                 target_mean_len=target_mean_len,
                                                 to_tensor=True)

        sin_train_dataloader = DataLoader(sin_train_serial_dataset, batch_size=batch_size, shuffle=True, num_workers=2,
                                          drop_last=True)

        criterion = nn.MSELoss()
        optimizer = torch.optim.Adam(lstm.parameters(), lr=learning_rate)
        for epoch_index in range(epochs):
            lstm.train()
            for batch_index, (data, target) in enumerate(sin_train_dataloader):
                # data -> (batch, len)

                data = data.unsqueeze(1).to(device).to(dtype=torch.float32)
                # torch.Size([32, 1, 256])

                target = target.to(device).to(dtype=torch.float32)
                # torch.Size([32])

                output = lstm(data)

                output = output.squeeze(-1)

                loss = criterion(output, target)
                optimizer.zero_grad()
                loss.backward()
                optimizer.step()
                print(
                    f"batch:{batch_index}/{len(sin_train_dataloader)}, epoch:{epoch_index}/{epochs}, loss:{round(loss.item(), 3)}")

        # ======== train finished ========
        lstm.eval()
        model_param = f'{stock_name[:-4]}-params.pth'
        parm_dir = os.path.join('model', model_param)
        torch.save(lstm.state_dict(), parm_dir)
        print('Params Saved...')
        prediction_steps = 20
        # indicating how many days you want to predict

        is_visualize = True
        # make it 'True' you want to visualize the prediction result

        pred_time_series = make_a_prediction(time_series, prediction_steps, time_step, lstm, is_visualize=is_visualize,
                                             device=device)

        # output !!!
        # the length of output should be: the length of input + prediction_steps
        print(f'{len(pred_time_series)=}')
        print(pred_time_series)


def train_user_model(time_series):
    """
    call this function when user updated a new data that we never used

    return: a new predict model that trained by user's own data

    """
    # time_series_train = time_series
    # sin_train_serial_dataset = SerialDataset(time_series_train, time_step=time_step,
    #                                          target_mean_len=target_mean_len,
    #                                          to_tensor=True)
    # sin_train_dataloader = DataLoader(sin_train_serial_dataset, batch_size=batch_size, shuffle=True, num_workers=2,
    #                                   drop_last=True)
    #
    # criterion = nn.MSELoss()
    # optimizer = torch.optim.Adam(lstm.parameters(), lr=learning_rate)
    # for epoch_index in range(epochs):
    #     lstm.train()
    #     for batch_index, (data, target) in enumerate(sin_train_dataloader):
    #         # data -> (batch, len)
    #
    #         data = data.unsqueeze(1).to(device).to(dtype=torch.float32)
    #         # torch.Size([32, 1, 256])
    #
    #         target = target.to(device).to(dtype=torch.float32)
    #         # torch.Size([32])
    #
    #         output = lstm(data)
    #
    #         output = output.squeeze(-1)
    #
    #         loss = criterion(output, target)
    #         optimizer.zero_grad()
    #         loss.backward()
    #         optimizer.step()
    #         print(
    #             f"batch:{batch_index}/{len(sin_train_dataloader)}, epoch:{epoch_index}/{epochs}, loss:{round(loss.item(), 3)}")
    #         lstm.eval()
    pass


if __name__ == '__main__':
    main()
