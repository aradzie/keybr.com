import { test } from "node:test";
import { Application } from "@fastr/core";
import { deepEqual, equal } from "rich-assert";
import { kMain } from "../module.ts";
import { TestContext } from "../test/context.ts";
import { startApp } from "../test/request.ts";

const context = new TestContext();

test("get profile", async () => {
  // Arrange.

  const request = startApp(context.get(Application, kMain));

  // Act.

  const response = await request.GET(`/_/profile/55vdtk1`).send();

  // Assert.

  equal(response.status, 200);
  deepEqual(await response.body.json(), {
    id: "55vdtk1",
    imageUrl: "imageUrl1",
    name: "externalName1",
    premium: false,
  });
});
