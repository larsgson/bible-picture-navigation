import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Fab from '@material-ui/core/Fab'
import ChevronLeft from '@material-ui/icons/ChevronLeft'

const CustomAppBar = (props) => {
  const { onClose } = props
  return (
    <AppBar
      sx={{ background: 'transparent', boxShadow: 'none'}}
    >
      <Toolbar>
        <Grid container alignItems="center" spacing={2}>
          <Fab
            onClick={() => onClose()}
            // className={largeScreen ? classes.exitButtonLS : classes.exitButton}
            color="primary"
          >
            <ChevronLeft />
          </Fab>
          <Grid item>
            <Typography
            sx={{
                fontFamily: "'Work Sans', sans-serif",
                fontSize: 18,
                textDecoration: 'none',
                width: '100%'
              }}
            color="inherit"
          >
              Gospel of John
            </Typography>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  )
}

export default CustomAppBar
