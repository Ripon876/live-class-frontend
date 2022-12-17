import React from 'react'
import Header from '../components/Header'
import { Box, Typhography, useTheme } from "@mui/material";
const stations=[
    {id:1, stationName:"Station A"},
    {id:2, stationName:"Station B"},
    {id:3, stationName:"Station C"},
    {id:4, stationName:"Station D"},
    {id:5, stationName:"Station E"},
    {id:6, stationName:"Station F"},
    {id:7, stationName:"Station G"},
    {id:8, stationName:"Station I"},
    {id:9, stationName:"Station J"},
    {id:10, stationName:"Station k"},
    {id:11, stationName:"Station L"},
    {id:9, stationName:"Station J"},
    {id:10, stationName:"Station k"},
    {id:11, stationName:"Station L"},
]
const Stations = () => {
  return (
    <Box m="20px">
   <Header title="Stations" subtitle="Manage Your Stations"/>
    <Box  display="flex" backgroundColor="#f3f3f3" flex="1" flexWrap="wrap" className='stations'>
        {stations.map((st)=><Box width="25%" height="100px">{st.stationName}</Box>)}
    </Box>
   </Box>
  )
}

export default Stations