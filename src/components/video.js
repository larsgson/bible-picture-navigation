import React, { useState, useEffect, useRef } from 'react'
import ReactPlayer from 'react-player'
import makeStyles from '@mui/styles/makeStyles';
import useBrowserData from '../hooks/useBrowserData'

const useStyles = makeStyles(() => ({
  playerWrapper: {
    position: 'relative',
    paddingTop: '56.25%'
  },
  playerWrapperFB: {
    height: 500,
    paddingBottom: 0,
  },
  reactPlayer: {
    position: 'absolute',
    top: 0,
    left: 0,
  }
}))

const VideoPlayer = (props) => {
  const classes = useStyles()
  const [startPos, setStartPos] = useState(0)
  const {width, height} = useBrowserData()
  const {playFromPosition, isPaused, url, fullSize, isFB} = props
  const playerRef = useRef()

  const movePos = (newPos) => {
    setStartPos(newPos)
    const durMSec = playerRef.current.getDuration() * 1000
    if (durMSec>newPos){
      playerRef.current.seekTo(newPos/1000)
    }
  }

  useEffect(() => {
    if ((playerRef.current!=null) && (playFromPosition != null)&&!isNaN(playFromPosition)&&(playFromPosition>0)) {
      movePos(playFromPosition)
    }
  },[playFromPosition,playerRef])

  const onDuration = (duration) => {
    const newPos = startPos
    const durMSec = duration * 1000
    if (durMSec>newPos){
      playerRef.current.seekTo(newPos/1000)
    }
    if (props.onDuration!=null){
      props.onDuration(duration)
    }
  }

  const configTest = { file: {
      forceVideo: true
    }}
  return (
    <div className={isFB ? classes.playerWrapperFb : fullSize ? classes.playerWrapper : null }>
      <ReactPlayer
        ref={playerRef}
        className={fullSize ? classes.reactPlayer : null}
        url={url}
        config={configTest}
        onEnded={props.onEnded}
        onDuration={onDuration}
        onProgress={props.onProgress}
        width={fullSize ? '100%' : width}
        height={fullSize ? '100%' : height}
        playing={!isPaused}
        controls
      />
    </div>
  )
}

export default VideoPlayer
