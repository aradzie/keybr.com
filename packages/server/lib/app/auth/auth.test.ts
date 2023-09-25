import { Application } from "@fastr/core";
import { User } from "@keybr/database";
import { PublicId } from "@keybr/publicid";
import { ResultFaker } from "@keybr/result";
import { UserDataFactory } from "@keybr/result-userdata";
import { kMain } from "../module.ts";
import { test } from "../test/context.ts";
import { startApp } from "../test/request.ts";
import { findUser } from "../test/sql.ts";

test.serial("logout", async (t) => {
  // Arrange.

  const user = await findUser("user1@keybr.com");

  const request = startApp(t.context.get(Application, kMain));

  await request.become(user.id!);

  // Act.

  const response = await request.GET("/auth/logout").send();

  // Assert.

  t.is(response.status, 302);
  t.is(response.headers.get("Location"), "/account");
  t.is(await request.who(), null);
});

test.serial("patch account", async (t) => {
  // Arrange.

  const user = await findUser("user1@keybr.com");

  const request = startApp(t.context.get(Application, kMain));

  await request.become(user.id!);

  {
    // Act.

    const response = await request.PATCH("/_/account").send({
      anonymized: true,
    });

    // Assert.

    t.is(response.status, 200);
    t.like(await response.body.json(), {
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
    t.like((await User.findById(user.id!))!.toJSON(), {
      anonymized: 1,
    });
  }

  {
    // Act.

    const response = await request.PATCH("/_/account").send({
      anonymized: false,
    });

    // Assert.

    t.is(response.status, 200);
    t.like(await response.body.json(), {
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
    t.like((await User.findById(user.id!))!.toJSON(), {
      anonymized: 0,
    });
  }
});

test.serial("delete account", async (t) => {
  // Arrange.

  const factory = t.context.get(UserDataFactory);
  const user = await findUser("user1@keybr.com");
  const userData = factory.load(new PublicId(user.id!));
  const faker = new ResultFaker();
  await userData.append([faker.nextResult()]);

  const request = startApp(t.context.get(Application, kMain));

  await request.become(user.id!);

  // Act.

  const response = await request.DELETE("/_/account").send();

  // Assert.

  t.is(response.status, 204);
  t.is(await request.who(), null);
  t.is(await User.findById(user.id!), null);
  t.true(await userData.exists());
});
