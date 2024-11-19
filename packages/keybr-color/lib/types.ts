/** A color with the red, green, blue and alpha components. */
export type Rgb = {
  /** The red component, a number in range [0,1]. */
  r: number;
  /** The green component, a number in range [0,1]. */
  g: number;
  /** The blue component, a number in range [0,1]. */
  b: number;
  /** The alpha component, a number in range [0,1]. */
  a: number;
};

/** A color with the hue, saturation, lightness and alpha components. */
export type Hsl = {
  /** The hue component, a number in range [0,1]. */
  h: number;
  /** The saturation component, a number in range [0,1]. */
  s: number;
  /** The lightness component, a number in range [0,1]. */
  l: number;
  /** The alpha component, a number in range [0,1]. */
  a: number;
};

/** A color with the hue, whiteness, blackness and alpha components. */
export type Hwb = {
  /** The hue component, a number in range [0,1]. */
  h: number;
  /** The whiteness component, a number in range [0,1]. */
  w: number;
  /** The blackness component, a number in range [0,1]. */
  b: number;
  /** The alpha component, a number in range [0,1]. */
  a: number;
};

/** A color with the hue, saturation, value and alpha components. */
export type Hsv = {
  /** The hue component, a number in range [0,1]. */
  h: number;
  /** The saturation component, a number in range [0,1]. */
  s: number;
  /** The value component, a number in range [0,1]. */
  v: number;
  /** The alpha component, a number in range [0,1]. */
  a: number;
};
