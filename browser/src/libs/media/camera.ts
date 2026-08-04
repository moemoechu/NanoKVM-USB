import { checkPermission } from '@/libs/media/permission.ts';

class Camera {
  id: string = '';
  width: number = 1920;
  height: number = 1080;
  audioId: string = '';
  stream: MediaStream | null = null;
  frameRate: number = 30;
  brightness = 42;
  contrast = 48;
  saturation = 50;

  public async open(
    id: string,
    width: number,
    height: number,
    audioId?: string,
    advanced?: { frameRate?: number; brightness?: number; contrast?: number; saturation?: number }
  ) {
    if (!id && !this.id) {
      return;
    }

    this.close();

    const {
      frameRate = this.frameRate,
      brightness = this.brightness,
      contrast = this.contrast,
      saturation = this.saturation
    } = advanced ?? {};

    const video = {
      deviceId: { exact: id },
      width: { ideal: width },
      height: { ideal: height },
      frameRate: frameRate,
      brightness,
      contrast,
      saturation,
      latency: { ideal: 0 },
      resizeMode: 'none'
    };

    const isMicGranted = await checkPermission('microphone');
    const audio =
      isMicGranted && audioId
        ? {
            deviceId: { exact: audioId },
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
            sampleRate: 48000,
            latency: 0
          }
        : false;

    this.id = id;
    this.width = width;
    this.height = height;
    this.frameRate = frameRate ?? this.frameRate;
    this.brightness = brightness;
    this.contrast = contrast;
    this.saturation = saturation;
    if (audioId) this.audioId = audioId;

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video, audio });
    } catch {
      this.stream = await navigator.mediaDevices.getUserMedia({ video, audio: false });
    }
  }

  public async updateResolution(width: number, height: number) {
    return this.open(this.id, width, height, this.audioId);
  }

  public async updateFrameRate(frameRate: number) {
    return this.open(this.id, this.width, this.height, this.audioId, { frameRate });
  }

  public async updateAdvanced(advanced: {
    brightness?: number;
    contrast?: number;
    saturation?: number;
  }) {
    return this.open(this.id, this.width, this.height, this.audioId, {
      frameRate: this.frameRate,
      ...advanced
    });
  }

  public close(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
  }

  public getStream(): MediaStream | null {
    return this.stream;
  }

  public isOpen(): boolean {
    return this.stream !== null;
  }
}

export const camera = new Camera();
