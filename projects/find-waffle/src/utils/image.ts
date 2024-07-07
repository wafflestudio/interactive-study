/**
 * 주어진 URL로부터 이미지를 로드합니다.
 *
 * @param url 이미지 URL
 * @returns 이미지 비트맵 Promise
 */
export async function loadImage(url: string): Promise<ImageBitmap> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load image: ${url}`);
  }
  const blob = await response.blob();
  return createImageBitmap(blob);
}

type ColorSource = CanvasFillStrokeStyles['fillStyle'];

export function createSolidColorImage(
  color: ColorSource,
  width: number,
  height: number,
): ImageBitmap {
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  return canvas.transferToImageBitmap();
}

type CompsiteImageOptions = {
  // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
  compositeOperation?: GlobalCompositeOperation;
  // true일 경우 overlay의 크기를 base의 크기로 맞춥니다.
  fill?: boolean;
};

/**
 * 2개의 이미지를 합성합니다.
 * 합성된 이미지의 크기는 base의 크기 또는 overlay의 크기(base가 색상일 경우)와 같습니다.
 *
 * @param base 배경 이미지 또는 색상
 * @param overlay 덧씌울 이미지
 * @return 합성된 이미지
 */
export function compositeImage(
  base: HTMLCanvasElement | ImageBitmap | ColorSource,
  overlay: ImageBitmap,
  {
    compositeOperation = 'source-over',
    fill = false,
  }: CompsiteImageOptions = {},
): ImageBitmap {
  if (
    typeof base === 'string' ||
    base instanceof CanvasGradient ||
    base instanceof CanvasPattern
  ) {
    base = createSolidColorImage(base, overlay.width, overlay.height);
  }
  const canvas = new OffscreenCanvas(base.width, base.height);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(base, 0, 0);
  ctx.globalCompositeOperation = compositeOperation;
  if (fill) {
    ctx.drawImage(overlay, 0, 0, base.width, base.height);
  } else {
    ctx.drawImage(
      overlay,
      (base.width - overlay.width) / 2,
      (base.height - overlay.height) / 2,
    );
  }
  return canvas.transferToImageBitmap();
}
