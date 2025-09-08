class Camera {
  id: string = '';
  width: number = 1920;
  height: number = 1080;
  frameRate: number = 30;
  audioId: string = '';
  stream: MediaStream | null = null;

  public async open(
    id: string,
    width: number,
    height: number,
    frameRate: number,
    audioId?: string
  ) {
    if (!id && !this.id) {
      return;
    }

    this.close();

    const constraints = {
      video: {
        deviceId: { exact: id },
        width: { ideal: width },
        height: { ideal: height },
        frameRate: frameRate
      },
      audio: audioId ? { deviceId: { exact: audioId } } : false
    };

    this.id = id;
    this.width = width;
    this.height = height;
    this.frameRate = frameRate;
    if (audioId) this.audioId = audioId;
    this.stream = await navigator.mediaDevices.getUserMedia(constraints);
  }

  public async updateResolution(width: number, height: number) {
    return this.open(this.id, width, height, this.frameRate, this.audioId);
  }

  public async updateFrameRate(frameRate: number) {
    return this.open(this.id, this.width, this.height, frameRate, this.audioId);
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
