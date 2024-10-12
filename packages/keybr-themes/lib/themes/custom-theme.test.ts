import test from "ava";
import { Color } from "./color.ts";
import { CustomTheme } from "./custom-theme.ts";

test("theme", (t) => {
  const white = Color.parse("#ffffff");
  const black = Color.parse("#000000");

  const a = new CustomTheme();
  const b = a.set("--primary", white);
  const c = b.set("--primary", black);

  t.not(a, b);
  t.not(b, c);
  t.not(a, c);

  t.deepEqual([...a], []);
  t.deepEqual([...b], [["--primary", white]]);
  t.deepEqual([...c], [["--primary", black]]);

  t.is(a.get("--primary"), null);
  t.is(b.get("--primary"), white);
  t.is(c.get("--primary"), black);
});
