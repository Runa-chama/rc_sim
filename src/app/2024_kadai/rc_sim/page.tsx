"use client"

import React, { useEffect, useState,memo } from "react";
import { Box, Paper, Typography, TextField,InputAdornment, Button } from "@mui/material"
import { LineChart} from "@mui/x-charts/LineChart"
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

import circuit_image from "./circuit.png"
import Image from "next/image";


const default_resistance = 1000;
const default_capacitance = 0.001;
const default_voltage = 3;
const default_interval = 0.2;
const default_time = 5;

const p_sx ={
    p:1,
    m:1
}

const b_sx = {
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
    const [data2,set_data2] = useState([0]);
    const [x_axis,set_x_axis] = useState([0]);
    
    const set_graphdata = () => {
        let data1_buf : number[] = [0];
        let data2_buf : number[] = [0];
        let x_axis_buf : number[] = [0];
        if(capacitance == 0 || resistance == 0 || interval == 0)
            return;

        const number_of_data = time / interval;
        const max_points = 100; // グラフに表示する最大データポイント数
        let step : number = 0;
        const between = Math.ceil(number_of_data / max_points); 
        let v_cache = 0;
        for(let now : number = interval; now <= time+interval; now=Number((now+interval).toFixed(5)))
        {
            const v : number = v_cache;
            const approximate : number = v + ((voltage - v)  * interval )/ (capacitance * resistance);   //近似式での計算
            const exact = voltage * (1 - Math.exp(-1.0 * now / (capacitance * resistance)));
            
            if(step % between == 0 || now+interval > time)
            {
                data1_buf.push(approximate);
                data2_buf.push(exact);
                x_axis_buf.push(Number(now.toFixed(5)));
            }

            v_cache = approximate;
            step++;
        }
        console.log(x_axis_buf);
        set_data1(data1_buf);
        set_data2(data2_buf);
        set_x_axis(x_axis_buf);
    }

    useEffect(() => {
        set_resistance(default_resistance);
        set_capacitance(default_capacitance);
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

            <Paper sx={{...p_sx}} >
                <Typography variant="h5">Chart Area</Typography>
                <Box display="flex">
                    <Box alignContent="center" sx={{m:0,p:0,ml:1,mr:-1,width:"1em"}}>
                        <Typography sx={{transform:"rotate(-90deg)",textAlign:"center",textWrap:"nowrap",fontSize:18}}>v(t) : Voltage (V)</Typography>
                    </Box>
                    <LineChart
                        xAxis={[{ data: x_axis ,label:"t : Time (s)",labelFontSize:18,tickFontSize:16,max:time}]}
                        yAxis={[{tickFontSize:16}]}
                        series={[
                            {
                                data: data1,
                                label: "Approximate formula",
                                valueFormatter: (value) => (value === null ? '' : value.toFixed(7)),
                            },
                            {
                                data: data2,
                                label: "Exact formula",
                                valueFormatter: (value) => (value === null ? '' : value.toFixed(7)),
                            }
                        ]}
                        grid={{ vertical: true, horizontal: true}}
                        height={600}
                        
                    /> 
                </Box>

            </Paper>

            <Paper sx={p_sx}>
                <Box display="flex" flexWrap="wrap">

                    {/*各種設定*/}
                    <Box sx={b_sx}>
                        <Typography variant="h5">Inputs</Typography>

                        {/*回路設定*/}
                        <Box display="flex" alignContent="center" flexWrap="wrap">
                            <Box sx={b_sx}>
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

                            <Box sx={b_sx}>
                                <Typography>C : Capacitance</Typography>
                                <TextField
                                    type="number"
                                    variant="outlined"
                                    InputProps={{
                                        inputProps:{min:0,step:"0.001"},
                                        endAdornment: <InputAdornment position="start">F</InputAdornment>
                                    }}
                                    defaultValue={default_capacitance}
                                    onChange={(event) => set_capacitance(Number(event.target.value))}
                                />
                            </Box>

                            <Box sx={b_sx}>
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
                        </Box> 
                        {/*END : 回路設定*/}
                        
                        {/*シミュレーション設定*/}
                        <Box display="flex" alignContent="center" flexWrap="wrap">
                            <Box sx={b_sx}>
                                <Typography>Δt : Simulation interval</Typography>
                                <TextField
                                    type="number"
                                    variant="outlined"
                                    InputProps={{
                                        inputProps:{min:0.0001,step:"0.0001",max:resistance*capacitance/10},
                                        endAdornment: <InputAdornment position="start">s</InputAdornment>
                                    }}
                                    defaultValue={default_interval}
                                    onChange={(event) => set_interval(Number(event.target.value))}
                                />
                            </Box>

                            <Box sx={b_sx}>
                                <Typography>Simulation time</Typography>
                                <TextField
                                    type="number"
                                    variant="outlined"
                                    InputProps={{
                                        inputProps:{min:interval},
                                        endAdornment: <InputAdornment position="start">s</InputAdornment>
                                    }}
                                    defaultValue={default_time}
                                    onChange={(event) => set_time(Number(event.target.value))}
                                />
                            </Box>
                        </Box>
                        {/*END : シミュレーション設定*/}
                    </Box>
                    {/*END : 各種設定 */}
                    
                    {/*数式*/}
                    <Box sx={b_sx}>
                        <Typography variant="h5">Formula</Typography>
                        <Box>
                            <Typography>Approximate formula</Typography>
                            <InlineMath math="v(t+\Delta t) =v(t)+\dfrac{\Delta t(E-v(t))}{CR}"/>
                        </Box>

                        <Box>
                            <Typography>Exact formula</Typography>
                            <InlineMath math="v(t) = E(1-\exp(-\frac{t}{CR}))"/>
                        </Box>
                    </Box>
                    {/*END : 数式*/}
                    <Box sx={b_sx}>
                        <Typography variant="h5">Circuit</Typography>
                        <Image  src={circuit_image} alt="circuit image" width={350}/>
                    </Box>
                </Box>
            </Paper>
        </Box>
    )
}