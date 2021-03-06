import React, { useState, useEffect } from 'react';
import { connectWithRedux, videoControl, CTP_LOADING, CTP_ENDED } from '../../../Utils';
import './index.css';

const PS_PLAY = 'play';
const PS_PAUSE = 'pause';
const PS_NOTHING = 'nothing';

let timeOutEl = null;
let lastPaused = true;

function BigPlayButtonWithRedux({ paused = true, ctpPriEvent = CTP_LOADING, isPrimary = false }) {
  const [pauseStatus, setPauseStatus] = useState(true);

  const handleClick = () => {
    if (ctpPriEvent === CTP_ENDED) {
      videoControl.replay();
    }
    // videoControl.handlePause()
  };

  useEffect(() => {
    if (lastPaused !== paused) {
      if (timeOutEl) clearTimeout(timeOutEl);
      setPauseStatus(paused ? PS_PAUSE : PS_PLAY);
      lastPaused = paused;
      timeOutEl = setTimeout(() => setPauseStatus(PS_NOTHING), 300);
    }
  }, [paused]);

  return isPrimary ? (
    <div className="wbp-btn-container" paused={paused.toString()} aria-hidden="true">
      {ctpPriEvent === CTP_ENDED ? (
        <button className="wbp-btn plain-btn" onClick={handleClick} aria-label="Replay">
          <span className="big-play-button-content" tabIndex="-1">
            <i className="material-icons">replay</i>
          </span>
        </button>
      ) : ctpPriEvent === CTP_LOADING ? (
        <div>
          <div className="sk-chase" color="green">
            <div className="sk-chase-dot" />
            <div className="sk-chase-dot" />
            <div className="sk-chase-dot" />
            <div className="sk-chase-dot" />
            <div className="sk-chase-dot" />
            <div className="sk-chase-dot" />
          </div>
        </div>
      ) : pauseStatus === PS_PAUSE ? (
        <button
          data-show-and-fade
          id="wbpb-pause"
          className="wbp-btn plain-btn"
          // onClick={handleClick}
          aria-hidden="true"
        >
          <span className="big-play-button-content" tabIndex="-1">
            <i className="material-icons">pause</i>
          </span>
        </button>
      ) : pauseStatus === PS_PLAY ? (
        <div
          data-show-and-fade
          id="wbpb-play"
          className="wbp-btn plain-btn"
          // onClick={handleClick}
          aria-hidden="true"
        >
          <span className="big-play-button-content" tabIndex="-1">
            <i className="material-icons">play_arrow</i>
          </span>
        </div>
      ) : null}
    </div>
  ) : null;
}

export const BigPlayButton = connectWithRedux(BigPlayButtonWithRedux, ['paused', 'ctpPriEvent']);
