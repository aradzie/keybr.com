export class FakeCanvasRenderingContext2D implements CanvasRenderingContext2D {
  canvas: HTMLCanvasElement;
  direction = "inherit" as const;
  fillStyle = "";
  filter = "";
  font = "";
  fontKerning = "auto" as const;
  fontStretch = "normal" as const;
  fontVariantCaps = "normal" as const;
  globalAlpha = 0;
  globalCompositeOperation = "source-over" as const;
  imageSmoothingEnabled = false;
  imageSmoothingQuality = "high" as const;
  letterSpacing = "";
  lineCap = "butt" as const;
  lineDashOffset = 0;
  lineJoin = "round" as const;
  lineWidth = 0;
  miterLimit = 0;
  shadowBlur = 0;
  shadowColor = "";
  shadowOffsetX = 0;
  shadowOffsetY = 0;
  strokeStyle = "";
  textAlign = "start" as const;
  textBaseline = "top" as const;
  textRendering = "auto" as const;
  wordSpacing = "";

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  arc(): void {}

  arcTo(): void {}

  beginPath(): void {}

  bezierCurveTo(): void {}

  clearRect(): void {}

  clip(): void {}

  closePath(): void {}

  createConicGradient(): CanvasGradient {
    return new FakeCanvasGradient();
  }

  createImageData(): ImageData {
    return new FakeImageData();
  }

  createLinearGradient(): CanvasGradient {
    return new FakeCanvasGradient();
  }

  createPattern(): CanvasPattern {
    return new FakeCanvasPattern();
  }

  createRadialGradient(): CanvasGradient {
    return new FakeCanvasGradient();
  }

  drawFocusIfNeeded(): void {}

  drawImage(): void {}

  ellipse(): void {}

  fill(): void {}

  fillRect(): void {}

  fillText(): void {}

  getContextAttributes(): CanvasRenderingContext2DSettings {
    return {};
  }

  getImageData(): ImageData {
    return new FakeImageData();
  }

  getLineDash(): number[] {
    return [];
  }

  getTransform(): DOMMatrix {
    return { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0 } as DOMMatrix;
  }

  isPointInPath(): boolean {
    return false;
  }

  isPointInStroke(): boolean {
    return false;
  }

  lineTo(): void {}

  measureText(): TextMetrics {
    return new FakeTextMetrics();
  }

  moveTo(): void {}

  putImageData(): void {}

  quadraticCurveTo(): void {}

  rect(): void {}

  reset(): void {}

  resetTransform(): void {}

  restore(): void {}

  rotate(): void {}

  roundRect(): void {}

  save(): void {}

  scale(): void {}

  setLineDash(): void {}

  setTransform(): void {}

  stroke(): void {}

  strokeRect(): void {}

  strokeText(): void {}

  transform(): void {}

  translate(): void {}
}

export class FakeImageData implements ImageData {
  readonly colorSpace = "srgb";
  readonly data = new Uint8ClampedArray();
  readonly height = 100;
  readonly width = 100;
}

export class FakeCanvasGradient implements CanvasGradient {
  addColorStop(): void {}
}

export class FakeCanvasPattern implements CanvasPattern {
  setTransform(): void {}
}

export class FakeTextMetrics implements TextMetrics {
  readonly actualBoundingBoxAscent = 0;
  readonly actualBoundingBoxDescent = 0;
  readonly actualBoundingBoxLeft = 0;
  readonly actualBoundingBoxRight = 0;
  readonly alphabeticBaseline = 0;
  readonly emHeightAscent = 0;
  readonly emHeightDescent = 0;
  readonly fontBoundingBoxAscent = 0;
  readonly fontBoundingBoxDescent = 0;
  readonly hangingBaseline = 0;
  readonly ideographicBaseline = 0;
  readonly width = 0;
}
