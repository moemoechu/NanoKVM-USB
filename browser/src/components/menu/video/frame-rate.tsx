import { Popover } from 'antd';
import clsx from 'clsx';
import { useAtom } from 'jotai';
import { Gauge } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { frameRateAtom } from '@/jotai/device.ts';
import { camera } from '@/libs/camera';
import * as storage from '@/libs/storage';

export const FrameRate = () => {
  const { t } = useTranslation();
  const [frameRate, setFrameRate] = useAtom(frameRateAtom);

  const frameRates: number[] = [120, 90, 60, 50, 40, 30, 25, 10, 5];

  async function updateFrameRate(f: number) {
    try {
      await camera.updateFrameRate(f);
    } catch (err) {
      console.log(err);
      return;
    }

    const video = document.getElementById('video') as HTMLVideoElement;
    if (!video) return;
    video.srcObject = camera.getStream();

    setFrameRate(f);
    storage.setVideoFrameRate(f);
  }

  const content = (
    <>
      {frameRates.map((res) => (
        <div
          key={res}
          className={clsx(
            'flex cursor-pointer select-none items-center space-x-1 rounded px-3 py-1.5 hover:bg-neutral-700/60',
            frameRate === res ? 'text-blue-500' : 'text-white'
          )}
          onClick={() => updateFrameRate(res)}
        >
          <span className="flex w-[32px]">{res}</span>
        </div>
      ))}
    </>
  );

  return (
    <>
      <Popover content={content} placement="rightTop" arrow={false} align={{ offset: [13, 0] }}>
        <div className="flex h-[30px] cursor-pointer items-center space-x-2 rounded px-3 text-neutral-300 hover:bg-neutral-700">
          <Gauge size={18} />
          <span className="select-none text-sm">{t('video.frameRate')}</span>
        </div>
      </Popover>
    </>
  );
};
