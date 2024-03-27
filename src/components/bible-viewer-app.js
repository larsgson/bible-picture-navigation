import React, {useState} from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import BibleNavigation from './bible-navigation'
import GospelJohnNavi from './gospel-john-video-navi'
import useMediaPlayer from '../hooks/useMediaPlayer'

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
})

const defaultBackgroundStyle = {
  height: 'auto',
  minHeight: '100vh',
  background: '#181818',
  padding: 0,
  color: 'whitesmoke',
}

const BiblePictureNavigationApp = () => {
  const [gospelJohn,setGospelJohn] = useState(false)
  // eslint-disable-next-line no-unused-vars
  const { curPlay, startPlay } = useMediaPlayer()
  const handleStartBiblePlay = (curSerie,bookObj,id) => {
    const {bk} = bookObj
    const curEp = {bibleType: true,bk,id}
    startPlay(id,curSerie,curEp)
  }
  return (
    <div style={defaultBackgroundStyle}>
      <ThemeProvider theme={theme}>
      {gospelJohn && <GospelJohnNavi onClose={() => setGospelJohn(false)}/>}
      {!gospelJohn && (<BibleNavigation
        //      isPaused={isPaused}
        onReset={() => console.log("onReset")}
        onExitNavigation={() => console.log("onExitNavigation")}
        onStartPlay={handleStartBiblePlay}
        onClickGospelJohn={() => setGospelJohn(true)}
      />)}
      </ThemeProvider>
    </div>
  )
}

export default BiblePictureNavigationApp
