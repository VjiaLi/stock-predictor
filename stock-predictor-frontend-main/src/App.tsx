import FileUploadAndParser from "./Uploader.tsx";
import * as React from 'react';
import Box from '@mui/material/Box';
import {Paper, Stack,Typography} from "@mui/material";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TextLoop from "react-text-loop";
import { TrendingUp} from "@mui/icons-material";
import styles from './iframe.module.css'

function App() {


    const [value, setValue] = React.useState('1');

    const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };
    interface StockData {
        name: string;
        value: number;
        change: number;
        changePercentage: number;
    }
    const stockData: StockData[] = [
        {
            name: '道琼斯',
            value: 39272.99,
            change: -58.86,
            changePercentage: -0.15,
        },
        {
            name: '标普500',
            value: 5521.39,
            change: 12.38,
            changePercentage: 0.22,
        },
        {
            name: '纳斯达克',
            value: 18103.67,
            change: 74.91,
            changePercentage: 0.42,
        },
        {
            name: '加拿大S&P/TSX',
            value: 22194.11,
            change: 240.31,
            changePercentage: 1.09,
        },
        {
            name: '上证指数',
            value: 2982.38,
            change: -14.63,
            changePercentage: -0.49,
        },
        {
            name: '恒生指数',
            value: 17978.57,
            change: 209.43,
            changePercentage: 1.18,
        },
    ];
  return (
    <>

        <Box sx={{paddingX:'10%'}}>
            <Box marginX={"20px"} paddingY={'20px'}>
                <Typography>
                    <h1>第四组超酷股票预测机 - 2024.7.4</h1>
                    ⚠️投资有风险，入市需谨慎⚠️

                </Typography>
            </Box>
        <Paper elevation={10} sx={{paddingX:'1%', paddingTop:'2%'}}>
            <Stack direction={'row'} paddingX={'10px'} alignItems={'center'}>
                <TrendingUp fontSize={'large'} sx={{paddingX:'10px'} } />
                <TextLoop interval={2500} springConfig={{ stiffness: 200, damping: 10 }} >
                    {stockData.map((stock, index) => (
                        <Box key={index} mb={2}>
                            <Typography variant="h6" fontWeight="bold" color="brown">
                                {stock.name}
                            </Typography>
                            <Typography variant="body1">
                                [ {stock.value.toFixed(2)}]  {stock.change.toFixed(2)} ({stock.changePercentage.toFixed(2)}%)
                            </Typography>
                        </Box>
                    ))}
                </TextLoop>
            </Stack>
            <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value} >
                <Box sx={{ borderBottom: 1, borderColor: 'divider'} }>
                    <TabList onChange={handleChange} aria-label="lab API tabs example" variant={'fullWidth'}>
                        <Tab label="队员介绍" value="1" />
                        <Tab label="开始股票预测" value="2" />
                        <Tab label="LSTM介绍" value="3" />
                        <Tab label="LSTM之父介绍" value="4" />
                        <Tab label="介绍" value="5" />
                    </TabList>
                </Box>
                <TabPanel value="1">

                    <div className={styles.iframeBodySty}>
                        <iframe
                            id="iframe-shrink"
                            src={'team.html'}
                            width="100%"
                            height="500"
                            className={styles.iframeShrink}
                        />
                    </div>
                </TabPanel>
                <TabPanel value="2">
                    <FileUploadAndParser/>
                </TabPanel>
                <TabPanel value="3">
                    <iframe src={'L.html'} width="100%" height="500"></iframe>

                </TabPanel>
                <TabPanel value="4">
                    <iframe src={'./appleman/index.html'} width="100%" height="500"></iframe>
                </TabPanel>
                <TabPanel value="5">
                    <iframe src={'./appleman/introLSTM.html'} width="100%" height="500"></iframe>
                </TabPanel>
            </TabContext>
            </Box>
        </Paper>
        </Box>

    </>
  )
}

export default App
