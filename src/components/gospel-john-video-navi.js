import React, { useState } from 'react'
import TileItem from './tile-item'
import CustomAppBar from './app-bar'
import { gospelOfJohnObj } from '../constants/naviChaptersJohn'
import useMediaPlayer from "../hooks/useMediaPlayer"

const GospelJohnNavi = ({onClose}) => {
  const { startPlay } = useMediaPlayer()
  const [showDescr,setShowDescr] = useState(false)
  const handleShowDescr = (ev,val) => {
    ev.stopPropagation()
    setShowDescr(val)
  }
  const curObj = gospelOfJohnObj
  const handlePlay = (ev) => {
    ev.stopPropagation()
    if (startPlay!=null) {
      startPlay(0,curObj)
    }
  }
  const showEpList = curObj.fileList
  return (
    <div>
      <CustomAppBar onClose={onClose}/>
      <TileItem
        item={curObj}
        mTop={0}
        expanded={showDescr}
        infoTile={true}
        epList={showEpList}
        onClickPlay={(e) => handlePlay(e)}
        onClickExpand={(e) => handleShowDescr(e,!showDescr)}
      />
    </div>
  )
}

export default GospelJohnNavi
