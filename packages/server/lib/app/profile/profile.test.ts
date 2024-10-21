import { Application } from "@fastr/core";
import { kMain } from "../module.ts";
import { test } from "../test/context.ts";
import { startApp } from "../test/request.ts";

test("get profile", async (t) => {
  // Arrange.

  const request = startApp(t.context.get(Application, kMain));

  // Act.

  const response = await request.GET(`/_/profile/55vdtk1`).send();

  // Assert.

  t.is(response.status, 200);
  t.deepEqual(await response.body.json(), {
    id: "55vdtk1",
    imageUrl: "imageUrl1",
    name: "externalName1",
    premium: false,
  });
});
