import { ReactElement, useEffect } from 'react';
import { Popover, Slider } from 'antd';
import { useAtom } from 'jotai';
import { Contrast as ContrastIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDebouncedCallback } from 'use-debounce';

import { videoContrastAtom } from '@/jotai/device.ts';
import { camera } from '@/libs/camera';
import * as storage from '@/libs/storage';

export const Contrast = (): ReactElement => {
  const { t } = useTranslation();

  const [videoContrast, setVideoContrast] = useAtom(videoContrastAtom);

  useEffect(() => {
    const value = storage.getVideoContrast();
    if (value) {
      setVideoContrast(value);
    }
  }, []);

  const updateContrast = useDebouncedCallback(async (value: number) => {
    try {
      await camera.updateAdvanced({ contrast: value });
    } catch (err) {
      console.log(err);
      return;
    }

    const video = document.getElementById('video') as HTMLVideoElement;
    if (!video) return;
    video.srcObject = camera.getStream();

    setVideoContrast(value);
    storage.setVideoContrast(value);
  }, 300);

  const content = (
    <div className="h-[300px] w-[60px] py-3">
      <Slider
        vertical
        marks={{
          0: <span>0</span>,
          25: <span>25</span>,
          50: <span>50</span>,
          75: <span>75</span>,
          100: <span>100</span>
        }}
        range={false}
        included={false}
        min={0}
        max={100}
        step={1}
        defaultValue={videoContrast}
        onChange={updateContrast}
      />
    </div>
  );

  return (
    <Popover content={content} placement="rightTop" arrow={false} align={{ offset: [13, 0] }}>
      <div className="flex h-[30px] cursor-pointer items-center space-x-2 rounded px-3 text-neutral-300 hover:bg-neutral-700">
        <ContrastIcon size={18} />
        <span className="select-none text-sm">{t('video.contrast')}</span>
      </div>
    </Popover>
  );
};
