import {useState, useEffect} from 'react';
import {Box, Button, Container, Stack, Slider, TextField, CircularProgress, Typography} from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import { ChartsReferenceLine } from '@mui/x-charts/ChartsReferenceLine';




interface Serial {
    close: number;
    date: string;
}
interface RawJson {
    name:string;
    datas:[Serial]
}
interface PredJson {
    name:string;
    datas:[Serial]
    start_date:string
}

const FileUploadAndParser = () => {
    const [data, setData] = useState<Serial[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [json_for_send, setJson_for_send] = useState<RawJson | null>(null);
    const [startDate, setStartDate] = useState<string| null>(null);
    const [closeValues, setCloseValues] = useState<number[]>([]);
    const [dateLabels, setDateLabels] = useState<string[]>([]);
    const [n_points, setN_points] = useState<number>(100);
    const [n_predictions, setN_predictions] = useState<number>(20);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFile(event.target.files[0]);
        }
    };

    const sendData = () => {

        setIsLoading(true );
        fetch('http://localhost:8080/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body:  JSON.stringify({ ...json_for_send, n_predictions })
        }).then(response => {
            if (response.ok) {
                return response.json() as Promise<PredJson>;
            } else {
                throw new Error(`HTTP error ${response.status}`);
            }
        })
            .then(data => {
                setStartDate(data.start_date);
                setData(data.datas);
                console.log(data);
            })
            .catch(error => {
                console.error(error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        if (data.length > 0) {
            const last400Data = data.slice(-n_points);
            const closeValues = last400Data.map(item => item.close);
            const dateLabels = last400Data.map(item => item.date);
            setCloseValues(closeValues);
            setDateLabels(dateLabels);
        }
    }, [data,n_points]);

    const ProcessFile = () => {
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    setStartDate(null);
                    const jsonData = JSON.parse(reader.result as string);
                    setJson_for_send(jsonData as RawJson)
                    const close_data = jsonData['datas']
                    if (Array.isArray(close_data)) {
                        setData(close_data as Serial[]);
                    } else {
                        console.error('Uploaded file is not a JSON array');
                    }
                } catch (error) {
                    console.error('Error parsing JSON data:', error);
                }
            };
            reader.readAsText(file);
        }
    };

    return (<div>
            <Container>
                <Stack direction={'row'} >
                <Stack direction={'column'} sx={{ paddingRight: '40px',maxWidth:'18%'}}>

                        <TextField
                            type="file"
                            onChange={handleFileChange}
                            label={null}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={ProcessFile}
                            sx={{mt: 2}}
                        >
                            加载证券数据
                        </Button>
                        <Button
                            variant="contained"

                            color="error"
                            onClick={sendData}
                            sx={{mt: 2}}
                        >
                            💵开始预测💵
                        </Button>

                    <Typography paddingTop={'10px'}> 调整展示天数</Typography>

                    <Slider
                        value={n_points}
                        min={50}
                        max={300}
                        step={1}
                        defaultValue={50}
                        valueLabelDisplay="auto"
                        onChangeCommitted={(_, newValue: number | number[]) => {
                            if (typeof newValue === "number") {
                                setN_points(newValue);
                            }
                        }}
                    />
                    <Typography> 调整预测天数</Typography>
                    <Slider
                        value={n_predictions}
                        min={5}
                        max={50}
                        step={1}
                        defaultValue={0}
                        valueLabelDisplay="auto"
                        onChangeCommitted={(_, newValue: number | number[]) => {
                            if (typeof newValue === "number") {
                                setN_predictions(newValue);
                            }
                        }}
                    /></Stack>
                    {isLoading && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <CircularProgress size={110}  variant={'indeterminate'} sx={{paddingX:"300px"}}/>
                        </Box>
                    )}
                    {
                        data.length > 0 && !isLoading &&(
                            <LineChart

                                height={400}
                                colors={['red']}
                                series={[
                                    { data: closeValues, label: file?.name + '收盘价格' },
                                ]}
                                xAxis={[{ scaleType: 'point', data: dateLabels }]}
                            >{ startDate != null && ( <ChartsReferenceLine
                                x={startDate as string}
                                label="预测起始"
                                lineStyle={{ stroke: 'green'}}

                            />)}
                            </LineChart>
                        )
                    }{
                    data.length == 0  &&(
                        <Box >
                        <img src='empty.png' style={{ height: '250px' }}/>
                        </Box>
                    )
                }
                </Stack>
            </Container>
        </div>
    );
};

export default FileUploadAndParser;