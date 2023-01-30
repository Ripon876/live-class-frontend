import React from 'react'
import { Typography, Box, useTheme } from '@mui/material'
import { tokens } from '../theme'

const Header = ({title, subtitle}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode)
  return (
    <Box>
    {/*<Typography variant="h2" ml={4} color={colors.primary[100]}>{title}</Typography>*/}
    <Typography variant="h4" ml={4} mt={4} color={colors.primary[100]}>{subtitle}</Typography>
    </Box>
  )
}

export default Header