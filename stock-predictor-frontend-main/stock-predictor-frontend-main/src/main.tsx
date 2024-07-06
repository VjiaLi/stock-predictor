
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import Box from "@mui/material/Box";

ReactDOM.render(
    <React.StrictMode>
        <Box
            sx={{
                backgroundImage: `url(https://logincdn.msauth.net/shared/1.0/content/images/appbackgrounds/49_6ffe0a92d779c878835b40171ffc2e13.jpg)`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center center",
                height: "150vh",
            }}>
            <App /></Box>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))

