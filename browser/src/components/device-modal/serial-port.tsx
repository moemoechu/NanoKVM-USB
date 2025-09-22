import { useEffect } from 'react';
import { Button } from 'antd';
import { useAtom } from 'jotai';
import { useTranslation } from 'react-i18next';

import { serialStateAtom } from '@/jotai/device.ts';
import { device } from '@/libs/device';
import { getLastSerialPortInfo, setLastSerialPortInfo } from '@/libs/storage';

type SerialPortProps = {
  setErrMsg: (msg: string) => void;
};

export const SerialPort = ({ setErrMsg }: SerialPortProps) => {
  const { t } = useTranslation();

  const [serialState, setSerialState] = useAtom(serialStateAtom);

  useEffect(() => {
    checkSerialPort();
  }, []);

  function checkSerialPort() {
    const isWebSerialSupported = 'serial' in navigator;
    const state = isWebSerialSupported ? 'disconnected' : 'notSupported';
    setSerialState(state);
  }

  async function selectSerialPort() {
    if (serialState === 'connecting') return;
    setSerialState('connecting');
    setErrMsg('');

    let port;
    try {
      const lastSerialPortInfo = getLastSerialPortInfo();
      if (lastSerialPortInfo) {
        const { usbProductId, usbVendorId } = lastSerialPortInfo;
        const availablePorts = await navigator.serial.getPorts();
        if (availablePorts) {
          for (const availablePort of availablePorts) {
            const portInfo = availablePort.getInfo();
            if (usbProductId === portInfo.usbProductId && usbVendorId === portInfo.usbVendorId) {
              port = availablePort;
            }
          }
        }
      } else {
        port = await navigator.serial.requestPort();
      }

      setLastSerialPortInfo(port.getInfo());
      await device.serialPort.init(port);

      setSerialState('connected');
    } catch (err) {
      console.log(err);
      setSerialState('disconnected');
      setErrMsg(t('serial.failed'));
      port = await navigator.serial.requestPort();
    }
  }

  return (
    <>
      {serialState !== 'notSupported' && (
        <Button
          type="primary"
          className="w-[250px]"
          loading={serialState === 'connecting'}
          onClick={selectSerialPort}
        >
          {t('modal.selectSerial')}
        </Button>
      )}
    </>
  );
};
