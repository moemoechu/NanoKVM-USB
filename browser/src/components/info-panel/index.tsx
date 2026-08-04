import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useAtomValue } from 'jotai';

import { isShowInfoAtom } from '@/jotai/device';

type VideoSettings = {
  width?: number;
  height?: number;
  frameRate?: number;
  brightness?: number;
  contrast?: number;
  saturation?: number;
};
type VideoPlaybackQuality = {
  corruptedVideoFrames?: number;
  creationTime?: number;
  droppedVideoFrames?: number;
  totalVideoFrames?: number;
};
type Info = {
  videoSettings?: VideoSettings;
  videoPlaybackQuality?: VideoPlaybackQuality;
  videoTrackStat?: { deliveredFrames: number; discardedFrames: number; totalFrames: number };
};
export const InfoPanel = () => {
  const isShowInfo = useAtomValue(isShowInfoAtom);
  const [info, setInfo] = useState<Info>({});

  const getInfo = () => {
    const video = document.getElementById('video') as HTMLVideoElement;
    const currentStream = video.srcObject as MediaStream;
    if (!currentStream) return;
    const videoTrack = currentStream.getVideoTracks()[0];
    const videoSettings = videoTrack.getSettings();
    // const capabilities = videoTrack.getCapabilities();
    const videoPlaybackQuality = video.getVideoPlaybackQuality();
    const info: Info = { videoSettings, videoPlaybackQuality };
    setInfo(info);
  };
  useEffect(() => {
    if (!isShowInfo) {
      return;
    }
    getInfo();
    const id = setInterval(getInfo, 1000);
    return () => {
      clearInterval(id);
    };
  }, [isShowInfo]);

  const { videoSettings = {}, videoPlaybackQuality = {} } = info;
  const {
    width = 0,
    height = 0,
    frameRate = 0,
    brightness = -1,
    contrast = -1,
    saturation = -1
  } = videoSettings;
  const {
    creationTime = -1,
    droppedVideoFrames = -1,
    totalVideoFrames = -1
  } = videoPlaybackQuality;
  return (
    <div className="pointer-events-none fixed left-[10px] top-[10px] z-[1000] opacity-60">
      <div
        className={clsx(
          'items-center justify-between space-x-1.5 rounded bg-neutral-800/60 p-2 px-3 text-white text-xs',
          isShowInfo ? 'flex' : 'hidden'
        )}
      >
        <div>
          <div>
            {width}x{height}@{frameRate}
          </div>
          <div>
            {brightness}/{contrast}/{saturation}
          </div>
          <div>
            {droppedVideoFrames}/{totalVideoFrames}@{Math.ceil(creationTime / 1000)}
          </div>
        </div>
      </div>
    </div>
  );
};
