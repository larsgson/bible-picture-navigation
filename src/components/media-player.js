/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import Fab from '@mui/material/Fab'
import NavClose from '@mui/icons-material/Close'
import VideoPlayer from './video'
import useMediaPlayer from "../hooks/useMediaPlayer"
import useBrowserData from '../hooks/useBrowserData'
import { apiObjGetStorage, apiObjSetStorage } from '../utils/api'
import CboxEpubPlayer from './cbox-epub'
import CboxReadOutLoud from './cbox-read-out-loud'
import CboxTrainingPlayer from './cbox-training'
import { freeAudioIdOsisMap } from '../osisFreeAudiobible'
import { audiobibleOsisId, osisIdAudiobibleTitle } from '../osisAudiobibleId'
import { getLocalMediaFName, isEmptyObj, pad } from '../utils/obj-functions'
// import { PDFViewer } from '../components/pdf-viewer'

let styles = {
  floatingButton: {
    margin: 0,
    left: 'auto',
    position: 'absolute',
    right: 0,
    zIndex: 1000,
  },
  footerFullsize: {
    height: '100%',
    position: 'fixed',
    right: 0,
    left: 0,
    bottom: 0,
    margin: 0,
    zIndex: 3,
    fontSize: 18,
  },
  footerFB: {
    height: '90%',
    position: 'fixed',
    right: 0,
    left: 0,
    bottom: 0,
    margin: 0,
    zIndex: 3,
    fontSize: 18,
  },
  footerVideo: {
    position: 'fixed',
    right: 0,
    left: 0,
    bottom: 0,
    margin: 0,
    zIndex: 3,
    fontSize: 18,
  },
  footer: {
    display: 'block',
    zIndex: 3,
    fontSize: 18,
    height: 64,
    position: 'fixed',
    right: 0,
    left: 0,
    paddingLeft: 64,
    bottom: 0,
    margin: 0,
    cursor: 'pointer'
  },
}

const Footer = () => {
  const {width, height} = useBrowserData()
  const player = useMediaPlayer()
  const { curPlay,
          onStopPlaying, setIsPaused, onPlaying, onFinishedPlaying,
          isPaused, isWaitingForPlayInfo} = player
  let tmpPlay = player.curPlay
  if (!tmpPlay) tmpPlay = {curSerie: undefined, curEp: undefined}
  const {curSerie,curEp} = tmpPlay
  const curEpInx = 0
  if (curSerie && curSerie.epList && curEpInx) {
//    curEp = curSerie.epList[curEpInx-1]
  }
  const [hasFinishedPlay, setHasFinishedPlay] = useState(false)
  const [startPos, setStartPos] = useState(0)
  const [curMsPos, setCurMsPos] = useState(undefined)
  const [pagePos, setPagePos] = useState(undefined)
  const [locPos, setLocPos] = useState(undefined)
  const [curPos, setCurPos] = useState()
  const [curDur, setCurDur] = useState()
  const storePos = (msPos) => apiObjSetStorage(curPlay,"mSec",msPos)

  useEffect(() => {
    let didCancel = false
    const restorePos = async (obj) => {
      await apiObjGetStorage(obj,"mSec").then((value) => {
        if (value==null) {
          if ((obj.curSerie!=null) && (obj.curEp!=null)) {
            value = curEp.begTimeSec * 1000
          } else {
            value=0
          }
        }
        if (!didCancel) {
          setStartPos(value)
          setCurMsPos(value)
        }
      }).catch((err) => console.error(err))
      await apiObjGetStorage(obj,"mSecDur").then((dur) => {
        if (!didCancel) setCurDur(dur)
      }).catch((err) => console.error(err))
    }
    if ((curSerie!=null) && (curEp!=null)){
      restorePos({curSerie, curEp})
    }
    return () => didCancel = true
  },[curPlay,curEp])

  const closeFooter = () => {
    storePos(curMsPos)
    setPagePos(undefined)
    if (onStopPlaying) onStopPlaying()
  }

  const movePos = (percent) => {
    if (percent!=null){
      let newPos = 0
      if (curDur!=null){
        newPos = Math.floor(percent * curDur / 100) // Divide by 100 in order to get promille - i.e. milliseconds
      }
      setHasFinishedPlay(false)
      setStartPos(newPos)
      setCurMsPos(newPos)
    }
  }

  const handleStop = () => setHasFinishedPlay(false)
  const handleSetPaused = (isPaused) => {
console.log("handleSetPaused")
    setIsPaused(isPaused)
    if (!isPaused) setHasFinishedPlay(false)
  }

  const handleLoading = (cur) => {
    if (curDur !== cur.duration){
      apiObjSetStorage(curPlay,"mSecDur",cur.duration)
      setCurDur(cur.duration)
    }
  }

  const updatePos = (cur) => {
    const newPos = Math.floor(cur.position / 1000)
    if (curPos !== newPos) {
      storePos(cur.position)
    }
    if (curDur !== cur.duration){
      apiObjSetStorage(curPlay,"mSecDur",cur.duration)
      setCurMsPos(cur.position)
      setCurPos(newPos)
      setCurDur(cur.duration)
    } else {
      setCurMsPos(cur.position)
      setCurPos(newPos)
    }
  }

  const handlePlaying = (cur) => {
// BUG FIX !!!
    const soundPlayerBugFix = hasFinishedPlay
    if (!soundPlayerBugFix){
      updatePos(cur)
      if (onPlaying) onPlaying(cur)
    }
  }

  const handleVideoDuration = (dur) => {
    const durMSec = dur * 1000
    apiObjSetStorage(curPlay,"mSecDur",durMSec)
    setCurDur(durMSec)
  }

  const handleVideoProgress = (pos) => {
    const posMSec = pos.playedSeconds *1000
    if (pos.playedSeconds>curEp.endTimeSec){
      closeFooter()
    } else {
      storePos(posMSec)
      setCurMsPos(posMSec)
      if (onPlaying){
        const cur = {position: posMSec, duration: curDur}
        onPlaying(cur)
      }
    }
  }

//   const handlePageProgress = (page) => {
//     storePagePos(page)
//   }

//   const handleLocationProgress = (loc) => {
// console.log(loc)
//     storeLocPos(loc)
//   }

  const handleFinishedVideoPlaying = () => {
    if (onFinishedPlaying) onFinishedPlaying()
  }

  const handleFinishedPlaying = () => {
console.log("handleFinishedPlaying")
    setHasFinishedPlay(true)
    handleFinishedVideoPlaying()
  }
  const onClose = () => {
    closeFooter()
  }

  const topMargin = 60

  const getPatternContent = (part,bk,chStr) => {
    if (part===1) return audiobibleOsisId[bk]
    else if (part===2) return osisIdAudiobibleTitle[bk]
    else if (part===3) return chStr
    return part
  }

  let curHeight = Math.trunc(width*9/16)
  if (curHeight>height-topMargin){
    curHeight = height-topMargin
  }

  let useSec
  let useDur
  let downloadName
  if (curMsPos!=null) useSec = Math.floor(curMsPos / 1000)
  if (curDur!=null) useDur = Math.floor(curDur / 1000)
  let locURL = ""
  let locPath = ""
  let videoFound = false
  let epubFound = false
  let pdfFound = false
  let htmlFound = false
  let bibleFound = false
  // let curPlayState = Sound.status.PLAYING
  const btnStyle =  Object.assign({}, styles.floatingButton)
  let idStr = "footer"
  let readOutLoud = false
  // if (isPaused) {
  //   curPlayState = Sound.status.PAUSED
  // }
  if ((curPlay!=null)) {
    let bibleObj
    if ((curEp!=null)&&(curEp.bibleType)) {
      bibleObj = curEp
    }
    if (curEp!=null) {
//      locURL = curEp.filename
        locURL = "https://www.youtube.com/watch?v=xEK-0n88zSI"
        locPath = locURL
    } else if ((curSerie!=null)&&(curSerie.curPath!=null)) {
      locURL = "https://www.youtube.com/watch?v=xEK-0n88zSI"
    }
//    locPath = getLocalMediaFName(locURL)
    locPath = locURL
    const typeFound = (type) => {
      if (curEp && curEp.mediaType) return curEp.mediaType===type
      return (curSerie &&(curSerie.mediaType===type))
    }
    epubFound = typeFound("epub")
    pdfFound = typeFound("pdf")
//    htmlFound = typeFound("html") || typeFound("pdf")
    htmlFound = typeFound("html")
    videoFound = typeFound("vid")
    bibleFound = typeFound("bible")

    if (bibleFound) {
      locURL = ""
      if (!isEmptyObj(bibleObj)){
        const {bk,id} = bibleObj
        let idStr = pad(id)
        let curFName
        if (curSerie.freeType) {
          if ((bk==="Ps") && (id<100)){
            idStr = "0" +pad(id)
          }
          curFName = curSerie.curPath + "/"
                            + freeAudioIdOsisMap[bk] + idStr + ".mp3"
        } else {
          curFName = curSerie.curPath + "/"
          curSerie.pathPattern && curSerie.pathPattern.forEach(part => {
            curFName += getPatternContent(part,bk,idStr)
          })
        }
        locURL = curFName
        locPath = getLocalMediaFName(locURL)
      }
    } else if (epubFound || htmlFound) {
      readOutLoud = curSerie.readOL
    }
  }
  if (epubFound || htmlFound) {
    if (width!=null) {
      btnStyle.left = (width-40)
    }
    btnStyle.top = 70
    btnStyle.width = 30
    btnStyle.height = 30
  } else if (pdfFound){
    if (width!=null) {
      btnStyle.left = (width-100)
    }
    btnStyle.top = 70
    btnStyle.width = 30
    btnStyle.height = 30
  } else if (videoFound){
    if (width!=null) {
      btnStyle.left = (width-40)
    }
    btnStyle.bottom = (curHeight-20)
    btnStyle.width = 30
    btnStyle.height = 30
  }
  if (videoFound){
    idStr = "footer-video"
  } else if (epubFound || htmlFound) {
    idStr = "footer-epub"
  }
  const fullSizeFound = videoFound
  const isFB = curEp && curEp.fb
  const position = 'relative'
  const top = '0px'
  if (locURL.length>0) {
    return (
      <footer
        id={idStr}
        style={isFB ?  styles.footerFB : videoFound ? styles.footerVideo : fullSizeFound ? styles.footerFullsize : styles.footer}>
        <div style={{position, top: top, height: '80%', width: '100%', maxWidth: isFB ? 450 : width}}>
          <Fab
            size="small"
            onClick={closeFooter}
            style={btnStyle}
          >
            <NavClose />
          </Fab>
          {videoFound && (
            <VideoPlayer
              url={locPath}
              fullSize={fullSizeFound}
              isFB={curEp.fb}
              isPaused={isPaused}
              playFromPosition={startPos}
              onEnded={handleFinishedVideoPlaying}
              onDuration={handleVideoDuration}
              onProgress={handleVideoProgress}
              width={width}
              height={curHeight}
              playing
              controls />
          )}
        </div>
      </footer>
    );
  } else {
     return (
       <footer id="footer" style={{display: 'none' }}>
       </footer>
    )
  }
}

export const MediaPlayer = (props) => {
  const [isWaitingForPlayInfo, setIsWaitingForPlayInfo] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [curCheckPos, setCurCheckPos] = useState(undefined)
  const [curPos, setCurPos] = useState()
  const player = useMediaPlayer()
  const {curSerie, curEp} = player

  const handlePlaying = (cur) => {
    if ((cur!=null) && (cur.position!=null)
      && isWaitingForPlayInfo){
      if (cur.position!==curCheckPos){
        setCurCheckPos(cur.position)
        setIsWaitingForPlayInfo(false)
      } else {
        setCurCheckPos(cur.position)
      }
    }
    const {curSerie} = props
    if ((curSerie!=null)&&(curSerie.nextLevelPos!=null)){
console.log(cur)
      if (cur.position-(curSerie.nextLevelPos*1000)>=cur.duration){
        if (props.onEndOfLevel!=null) props.onEndOfLevel()
      }
    }
    if (props.onPlaying) props.onPlaying({position: cur.position, duration: cur.duration})
console.log(cur)
    setCurPos(cur)
  }

  const handleStopPlaying = () => {
    player.onStopPlaying()
    setIsPaused(false)
    setIsWaitingForPlayInfo(false)
    setCurCheckPos(undefined)
    if (props.onStopPlaying) props.onStopPlaying()
  }

  return (
      <Footer
        curSerie={curSerie}
        curEp={curEp}
        isPaused={isPaused}
        isWaitingForPlayInfo={isWaitingForPlayInfo}
        curPos={curPos}
        onSetPaused={(isPaused) => setIsPaused(isPaused)}
        onPlaying={handlePlaying}
        onFinishedPlaying={() => props.onFinishedPlaying()}
        onStopPlaying={handleStopPlaying}
      />
  )
}

export default MediaPlayer
