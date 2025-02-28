declare module 'gif-frames' {
  import { Readable } from 'stream'

  interface Frame {
    getImage: () => Readable;
    frameIndex: number;
    delay: number;
    width: number;
    height: number;
  }

  interface GifFramesOptions {
    url: string | Buffer;
    frames: 'all' | number;
    outputType: 'png' | 'jpeg';
  }

  function gifFrames (options: GifFramesOptions): Promise<Frame[]>

  export = gifFrames
}
