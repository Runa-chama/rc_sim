"use client"

import React, { useEffect, useState,memo } from "react";
import { Box, Paper, Typography, TextField,InputAdornment, Button } from "@mui/material"
import { LineChart } from "@mui/x-charts/LineChart"

const default_resistance = 1000;
const default_capacitance = 1000;
const default_voltage = 3;
const default_interval = 0.2;
const default_time = 5;

const p_sx ={
    p:1,
    m:1
}



export default function RC_sim()
{
    const [resistance,set_resistance] = useState(0);
    const [capacitance,set_capacitance] = useState(0);
    const [voltage,set_voltage] = useState(0);
    const [interval,set_interval] = useState(0);
    const [time,set_time] = useState(0);

    const [data1,set_data1] = useState([0]);
    const [x_axis,set_x_axis] = useState([0]);
    
    const set_graphdata = () => {
        let data1_buf : number[] = [0];
        let x_axis_buf : number[] = [0];
        if(capacitance == 0 || resistance == 0 || interval == 0)
            return;

        const number_of_data = time / interval;
        let pickup = 0;
        let step = 0;
        if(number_of_data > 100)
        {
            pickup = Math.round(number_of_data / 100);
            console.log("pick"+pickup)
        }

        for(let now = 0; now < time; now += interval)
        {
            const v : number = Number(data1_buf.at(data1_buf.length-1));
            const calc = v + (voltage * interval - v * interval) / (capacitance * resistance);
            
            console.log("step"+step);
            if(step == pickup)
            {
                data1_buf.push(calc);
                x_axis_buf.push(now);
            }
            step = (step == pickup) ? 0 : step + 1;
        }
        console.log(data1_buf);
        set_data1(data1_buf);
        set_x_axis(x_axis_buf);
    }

    useEffect(() => {
        set_resistance(default_resistance);
        set_capacitance(default_capacitance*0.000001);
        set_voltage(default_voltage);
        set_interval(default_interval);
        set_time(default_time);
    },[])

    useEffect(() => {
        console.log("Values")
        console.log(resistance);
        console.log(capacitance);
        console.log(voltage);
        console.log(interval);
        console.log(time);
        set_graphdata();
    },[resistance,capacitance,voltage,interval,time])

    return(
        <Box>
            <Paper sx={{p:1,width:"100%",borderRadius:0}}>
                RC Simulator
            </Paper>

            <Paper sx={p_sx}>
                <Typography>Chart Area</Typography>
                <LineChart
                    xAxis={[{ data: x_axis }]}
                    series={[
                        {
                            data: data1,
                            valueFormatter: (value) => (value == null ? '' : value.toString()),
                        }
                    ]}
                    height={200}
                    margin={{ top: 10, bottom: 20 }}
                />            </Paper>

            <Paper sx={p_sx}>
                <Typography>Inputs</Typography>

                <Box>
                    <Typography>R : Resistance</Typography>
                    <TextField
                        type="number"
                        variant="outlined"
                        InputProps={{
                            inputProps:{min:0},
                            endAdornment: <InputAdornment position="start">Ω</InputAdornment>
                        }}
                        defaultValue={default_resistance}
                        onChange={(event) => set_resistance(Number(event.target.value))}
                    />
                </Box>

                <Box>
                    <Typography>C : Capacitance</Typography>
                    <TextField
                        type="number"
                        variant="outlined"
                        InputProps={{
                            inputProps:{min:0},
                            endAdornment: <InputAdornment position="start">μF</InputAdornment>
                        }}
                        defaultValue={default_capacitance}
                        onChange={(event) => set_capacitance(Number(event.target.value)*0.000001)}
                    />
                </Box>

                <Box>
                    <Typography>E : Voltage</Typography>
                    <TextField
                        type="number"
                        variant="outlined"
                        InputProps={{
                            inputProps:{min:0},
                            endAdornment: <InputAdornment position="start">V</InputAdornment>
                        }}
                        defaultValue={default_voltage}
                        onChange={(event) => set_voltage(Number(event.target.value))}
                    />
                </Box>

                <Box>
                    <Typography>Δt : Simulation interval</Typography>
                    <TextField
                        type="number"
                        variant="outlined"
                        InputProps={{
                            inputProps:{min:0},
                            endAdornment: <InputAdornment position="start">s</InputAdornment>
                        }}
                        defaultValue={default_interval}
                        onChange={(event) => set_interval(Number(event.target.value))}
                    />
                </Box>

                <Box>
                    <Typography>Simulation time</Typography>
                    <TextField
                        type="number"
                        variant="outlined"
                        InputProps={{
                            inputProps:{min:0},
                            endAdornment: <InputAdornment position="start">s</InputAdornment>
                        }}
                        defaultValue={default_time}
                        onChange={(event) => set_time(Number(event.target.value))}
                    />
                </Box>
            </Paper>
        </Box>
    )
}