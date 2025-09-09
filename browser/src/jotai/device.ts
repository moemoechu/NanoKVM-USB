import { atom } from 'jotai';

import type { Resolution } from '@/types.ts';

type VideoState = 'disconnected' | 'connecting' | 'connected';
type SerialState = 'notSupported' | 'disconnected' | 'connecting' | 'connected';

export const resolutionAtom = atom<Resolution>({
  width: 1920,
  height: 1080
});

export const frameRateAtom = atom<number>(30);
export const videoBrightnessAtom = atom<number>(50);
export const videoContrastAtom = atom<number>(50);
export const videoSaturationAtom = atom<number>(50);

export const videoScaleAtom = atom<number>(1.0)

export const videoDeviceIdAtom = atom('');
export const videoStateAtom = atom<VideoState>('disconnected');

export const serialStateAtom = atom<SerialState>('disconnected');
