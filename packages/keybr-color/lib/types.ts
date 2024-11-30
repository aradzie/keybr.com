type WithAlpha<T> = T & {
  /** The alpha component, a number in range [0,1]. */
  alpha: number;
};

/** A color with the red, green, blue and alpha components. */
export type Rgb = WithAlpha<{
  /** The red component, a number in range [0,1]. */
  r: number;
  /** The green component, a number in range [0,1]. */
  g: number;
  /** The blue component, a number in range [0,1]. */
  b: number;
}>;

/** A color with the hue, saturation, lightness and alpha components. */
export type Hsl = WithAlpha<{
  /** The hue component, a number in range [0,1]. */
  h: number;
  /** The saturation component, a number in range [0,1]. */
  s: number;
  /** The lightness component, a number in range [0,1]. */
  l: number;
}>;

/** A color with the hue, whiteness, blackness and alpha components. */
export type Hwb = WithAlpha<{
  /** The hue component, a number in range [0,1]. */
  h: number;
  /** The whiteness component, a number in range [0,1]. */
  w: number;
  /** The blackness component, a number in range [0,1]. */
  b: number;
}>;

/** A color with the hue, saturation, value and alpha components. */
export type Hsv = WithAlpha<{
  /** The hue component, a number in range [0,1]. */
  h: number;
  /** The saturation component, a number in range [0,1]. */
  s: number;
  /** The value component, a number in range [0,1]. */
  v: number;
}>;

export type Xyz = WithAlpha<{
  /** The `x` component. */
  x: number;
  /** The `y` component. */
  y: number;
  /** The `z` component. */
  z: number;
}>;

export type Oklab = WithAlpha<{
  /** The `L` component, a number in range [0,1]. */
  l: number;
  /** The `a` component, a number in range [-0.4,0.4]. */
  a: number;
  /** The `b` component, a number in range [-0.4,0.4]. */
  b: number;
}>;

export type Oklch = WithAlpha<{
  /** The `L` component, a number in range [0,1]. */
  l: number;
  /** The `C` component, a number in range [0,0.4]. */
  c: number;
  /** The hue component, a number in range [0,1]. */
  h: number;
}>;
