import { type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Identicon } from "./Identicon.tsx";

const names = [
  "Alpha Beta Gamma",
  "happy cat",
  "sad dog",
  "funny horse",
  "evil sheep",
  "kind camel",
  "somebody",
  "anybody",
  "nobody",
  "alpha",
  "omega",
  "alice",
  "bob",
  "eve",
];

function Page(): ReactNode {
  return (
    <html>
      <head>
        <title>shapes</title>
        <style>
          {"body { font-family: sans-serif; }\n" +
            ".Identicon { width: 10rem; height: 10rem; outline: 1px dotted #111; }\n"}
        </style>
      </head>
      <body>
        <p>
          {names.map((name) => (
            <Identicon key={name} className="Identicon" name={name} />
          ))}
        </p>
      </body>
    </html>
  );
}

console.log(renderToStaticMarkup(<Page />));
