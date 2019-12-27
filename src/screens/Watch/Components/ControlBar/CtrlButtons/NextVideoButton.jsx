import React from 'react'
import { connectWithRedux } from '_redux/watch'
import WatchCtrlButton from '../../WatchCtrlButton'
import { VideoCard } from 'components'
import {
  videoControl,
  findNeighbors
} from '../../../Utils'
import { api, util } from 'utils'
import { withRouter } from 'react-router'

export function NextVideoWithRedux({
  nextBtn=true,
  history,
  media,
  playlist,
  playlists,
}) {

  let { prev, next } = findNeighbors({ currMediaId: media.id, playlists })
  prev = api.parseMedia( prev )
  next = api.parseMedia( next )
  let canPlayPrev = Boolean(prev.id)
  let canPlayNext = Boolean(next.id)

  const handleChangeVideo = toWatch => {
    const courseNumber = util.parseURLFullNumber()
    let link = util.links.watch(courseNumber, toWatch.id, 0)
    let mediaState = { media, playlist, playlists }
    history.push(link, mediaState)
    videoControl.changeVideo(toWatch, playlist)
  }

  const handlePlayNext = () => {
    handleChangeVideo(next)
  }

  const handlePlayPrev = () => {
    handleChangeVideo(prev)
  }

  const watchPrev = <Video media={prev} />
  const watchNext = <Video media={next} nextVideo />

  if (nextBtn) {
    return (
      <WatchCtrlButton 
        onClick={handlePlayNext}
        label={ canPlayNext ? watchNext : 'End of the course' }
        id="next-video-btn"
        disabled={!canPlayNext}
        popupStyle={{padding: '0'}}
        popupPosition="0,0"
        ariaTags={{
          'aria-label': 'Next Video',
        }}
      >
        <span aria-hidden="true" className="watch-btn-content" tabIndex="-1">
          <i className="material-icons">skip_next</i>       
        </span>
      </WatchCtrlButton>
    )
  }

  else {
    return (
      <WatchCtrlButton 
        onClick={handlePlayPrev}
        label={ canPlayPrev ? watchPrev : 'End of the course' }
        id="next-video-btn"
        disabled={!canPlayPrev}
        popupStyle={{padding: '0'}}
        popupPosition="0,0"
        ariaTags={{
          'aria-label': 'Previous Video',
        }}
      >
        <span aria-hidden="true" className="watch-btn-content" tabIndex="-1">
          <i className="material-icons">skip_previous</i>       
        </span>
      </WatchCtrlButton>
    )
  }
}

function Video({ 
  media=null, 
  nextVideo=false
}) {
  const { id, mediaName } = media
  let name = nextVideo ? 'Next' : 'Previous'
  return (
    <div role="listitem"  className="watch-video-item search-result-listitem search-result-videos">
      <VideoCard row dark
        id={id}
        name={`<span>${name} Video</span> | ${mediaName}`}
        ratio={0}
        posterSize={'100px'}
        fittedNameSize={-1}
        listitem={false}
      />
    </div>
  )
}

export const NextVideoButton = withRouter(
  connectWithRedux(
    NextVideoWithRedux,
    ['media', 'playlist', 'playlists'],
    []
))


// export function PrevVideoWithRedux({

// }) {

// }
// export const PrevVideoButton = connectWithRedux(
//   PrevVideoWithRedux,
//   ['media', 'playlist', 'playlists'],
//   []
// )