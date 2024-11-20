import { test } from "node:test";
import { Application } from "@fastr/core";
import { User } from "@keybr/database";
import { PublicId } from "@keybr/publicid";
import { ResultFaker } from "@keybr/result";
import { UserDataFactory } from "@keybr/result-userdata";
import { equal, isNull, isTrue, like } from "rich-assert";
import { kMain } from "../module.ts";
import { TestContext } from "../test/context.ts";
import { startApp } from "../test/request.ts";
import { findUser } from "../test/sql.ts";

const context = new TestContext();

test("logout", async () => {
  // Arrange.

  const user = await findUser("user1@keybr.com");

  const request = startApp(context.get(Application, kMain));

  await request.become(user.id!);

  // Act.

  const response = await request.GET("/auth/logout").send();

  // Assert.

  equal(response.status, 302);
  equal(response.headers.get("Location"), "/account");
  isNull(await request.who());
});

test("patch account", async () => {
  // Arrange.

  const user = await findUser("user1@keybr.com");

  const request = startApp(context.get(Application, kMain));

  await request.become(user.id!);

  {
    // Act.

    const response = await request.PATCH("/_/account").send({
      anonymized: true,
    });

    // Assert.

    equal(response.status, 200);
    like(await response.body.json(), {
      user: {
        id: "55vdtk1",
        anonymized: true,
      },
      publicUser: {
        id: "55vdtk1",
        name: "Zealous Peacock",
        imageUrl: null,
      },
    });
    like((await User.findById(user.id!))!.toJSON(), {
      anonymized: 1,
    });
  }

  {
    // Act.

    const response = await request.PATCH("/_/account").send({
      anonymized: false,
    });

    // Assert.

    equal(response.status, 200);
    like(await response.body.json(), {
      user: {
        id: "55vdtk1",
        anonymized: false,
      },
      publicUser: {
        id: "55vdtk1",
        name: "externalName1",
        imageUrl: "imageUrl1",
      },
    });
    like((await User.findById(user.id!))!.toJSON(), {
      anonymized: 0,
    });
  }
});

test("delete account", async () => {
  // Arrange.

  const factory = context.get(UserDataFactory);
  const user = await findUser("user1@keybr.com");
  const userData = factory.load(new PublicId(user.id!));
  const faker = new ResultFaker();
  await userData.append([faker.nextResult()]);

  const request = startApp(context.get(Application, kMain));

  await request.become(user.id!);

  // Act.

  const response = await request.DELETE("/_/account").send();

  // Assert.

  equal(response.status, 204);
  isNull(await request.who());
  isNull(await User.findById(user.id!));
  isTrue(await userData.exists());
});
