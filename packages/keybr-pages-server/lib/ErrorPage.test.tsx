import { NotFoundError } from "@fastr/errors";
import { Manifest, ManifestContext } from "@keybr/assets";
import test from "ava";
import cheerio from "cheerio";
import { renderToStaticMarkup } from "react-dom/server";
import { ErrorPage, inspectError } from "./ErrorPage.tsx";

test("render", (t) => {
  const html = renderToStaticMarkup(
    <ManifestContext.Provider value={Manifest.fake}>
      <ErrorPage
        error={{
          expose: true,
          status: 400,
          message: "Bad Request",
        }}
      />
    </ManifestContext.Provider>,
  );

  const $ = cheerio.load(html);

  t.deepEqual($("html").attr(), {
    "lang": "en",
    "data-color": "light",
    "data-font": "opensans",
  });
  t.is($("title").text(), "400 - Bad Request");
  t.true($("body").text().includes("400 - Bad Request"));
});

test("inspect error", (t) => {
  // @ts-expect-error Test invalid arguments.
  t.is(inspectError(undefined), null);
  // @ts-expect-error Test invalid arguments.
  t.is(inspectError(null), null);
  // @ts-expect-error Test invalid arguments.
  t.is(inspectError(""), null);
  // @ts-expect-error Test invalid arguments.
  t.is(inspectError([]), null);
  // @ts-expect-error Test invalid arguments.
  t.is(inspectError({}), null);
  // @ts-expect-error Test invalid arguments.
  t.deepEqual(inspectError({ message: "omg" }), {
    message: "omg",
    status: 500,
    expose: false,
    description: null,
  });
  t.deepEqual(inspectError(new NotFoundError()), {
    message: "Not Found",
    status: 404,
    expose: true,
    description: null,
  });
  t.deepEqual(
    inspectError(
      new NotFoundError("OMG", {
        expose: false,
        description: "Page not found",
      }),
    ),
    {
      message: "OMG",
      status: 404,
      expose: false,
      description: "Page not found",
    },
  );
});
