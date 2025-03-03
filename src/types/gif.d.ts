declare module 'gif-frames' {
  import { Readable } from 'stream'

  interface FrameInfo {
    delay: number;
    width: number;
    height: number;
    disposal?: number;
    transparentColor?: number;
  }

  interface Frame {
    getImage: () => Readable;
    frameIndex: number;
    frameInfo: FrameInfo;
  }

  interface GifFramesOptions {
    url: string | Buffer;
    frames: 'all' | number[];
    outputType: 'png' | 'jpeg';
  }

  function gifFrames (options: GifFramesOptions): Promise<Frame[]>

  export default gifFrames
}
