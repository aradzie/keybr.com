import { test } from "node:test";
import { PublicId } from "@keybr/publicid";
import { ValidationError } from "objection";
import {
  deepEqual,
  doesNotThrow,
  equal,
  isNotNull,
  isNull,
  like,
  throws,
} from "rich-assert";
import { User, UserExternalId, UserLoginRequest } from "./model.ts";
import { useDatabase } from "./testing.ts";
import { Random } from "./util.ts";

useDatabase();

const now = new Date("2001-02-03T04:05:06Z");

test("validate models", (ctx) => {
  ctx.mock.timers.enable({ apis: ["Date"], now });

  throws(() => {
    User.fromJson({});
  }, ValidationError);

  throws(() => {
    User.fromJson({
      name: null,
      email: null,
    });
  }, ValidationError);

  throws(() => {
    User.fromJson({
      name: "",
      email: "",
    });
  }, ValidationError);

  doesNotThrow(() => {
    User.fromJson({
      name: "name",
      email: "email",
    });
  });

  throws(() => {
    UserExternalId.fromJson({});
  }, ValidationError);

  throws(() => {
    UserExternalId.fromJson({
      provider: null,
      externalId: null,
    });
  }, ValidationError);

  throws(() => {
    UserExternalId.fromJson({
      provider: "",
      externalId: "",
    });
  }, ValidationError);

  doesNotThrow(() => {
    UserExternalId.fromJson({
      provider: "provider",
      externalId: "externalId",
    });
  });

  doesNotThrow(() => {
    UserExternalId.fromJson({
      provider: "provider",
      externalId: "externalId",
      name: null,
      url: null,
      imageUrl: null,
    });
  });

  doesNotThrow(() => {
    UserExternalId.fromJson({
      provider: "provider",
      externalId: "externalId",
      name: "name",
      url: "url",
      imageUrl: "imageUrl",
    });
  });
});

test("automatically populate createdAt", async (ctx) => {
  ctx.mock.timers.enable({ apis: ["Date"], now });

  const user = await User.query().insertGraph({
    email: "user0@keybr.com",
    name: "user0",
    externalIds: [
      {
        provider: "provider0",
        externalId: "externalId0",
        name: "externalName0",
        url: "url0",
        imageUrl: "imageUrl0",
      },
    ],
  });

  deepEqual(user.createdAt, now);
  deepEqual(user.externalIds![0].createdAt, now);
});

test("generate unique user name", async (ctx) => {
  ctx.mock.timers.enable({ apis: ["Date"], now });

  await User.query().insertGraph({
    email: `test@keybr.com`,
    name: `test`,
    createdAt: now,
  });
  for (let i = 1; i <= 9; i++) {
    await User.query().insertGraph({
      email: `test${i}@keybr.com`,
      name: `test${i}`,
      createdAt: now,
    });
  }
  await User.query().insertGraph({
    email: `example@keybr.com`,
    name: `example`,
    createdAt: now,
  });

  equal(await User.findUniqueName(null, "x".repeat(100)), "x".repeat(32));
  equal(
    await User.findUniqueName(null, "x".repeat(100) + "@keybr.com"),
    "x".repeat(32),
  );
  equal(await User.findUniqueName(null, "unique"), "unique");
  equal(await User.findUniqueName(null, "unique@keybr.com"), "unique");
  equal(await User.findUniqueName(null, "test"), "test10");
  equal(await User.findUniqueName(null, "test@keybr.com"), "test10");
  equal(await User.findUniqueName("test@keybr.com", "test"), "test");
  equal(await User.findUniqueName("test@keybr.com", "test@keybr.com"), "test");
  equal(await User.findUniqueName(null, "test10"), "test10");
  equal(await User.findUniqueName(null, "test10@keybr.com"), "test10");
  equal(await User.findUniqueName("test@keybr.com", "example"), "example1");
  equal(
    await User.findUniqueName("test@keybr.com", "example@keybr.com"),
    "example1",
  );
});

test("create user from resource owner with null values", async (ctx) => {
  ctx.mock.timers.enable({ apis: ["Date"], now });

  const email = "example1@keybr.com";

  deepEqual(
    (
      await User.ensure({
        raw: {},
        provider: "provider1",
        id: "id1",
        email: email,
        name: null,
        url: null,
        imageUrl: null,
      })
    ).toJSON(),
    {
      id: 4,
      createdAt: now,
      email: email,
      name: "example1",
      anonymized: 0,
      externalIds: [
        {
          id: 4,
          userId: 4,
          createdAt: now,
          provider: "provider1",
          externalId: "id1",
          name: null,
          url: null,
          imageUrl: null,
        },
      ],
    } as unknown,
  );
});

test("create user from resource owner with non-null values", async (ctx) => {
  ctx.mock.timers.enable({ apis: ["Date"], now });

  const email = "example1@keybr.com";

  deepEqual(
    (
      await User.ensure({
        raw: {},
        provider: "provider1",
        id: "id1",
        email: email,
        name: "name1",
        url: "url1",
        imageUrl: "imageUrl1",
      })
    ).toJSON(),
    {
      id: 4,
      createdAt: now,
      email: email,
      name: "name1",
      anonymized: 0,
      externalIds: [
        {
          id: 4,
          userId: 4,
          createdAt: now,
          provider: "provider1",
          externalId: "id1",
          name: "name1",
          url: "url1",
          imageUrl: "imageUrl1",
        },
      ],
    } as unknown,
  );
});

test("create user from resource owner with invalid values", async (ctx) => {
  ctx.mock.timers.enable({ apis: ["Date"], now });

  const email = "example1@keybr.com";

  deepEqual(
    (
      await User.ensure({
        raw: {},
        provider: "provider1",
        id: "id1",
        email: email,
        name: null,
        url: "x".repeat(1000),
        imageUrl: "x".repeat(1000),
      })
    ).toJSON(),
    {
      id: 4,
      createdAt: now,
      email: email,
      name: "example1",
      anonymized: 0,
      externalIds: [
        {
          id: 4,
          userId: 4,
          createdAt: now,
          provider: "provider1",
          externalId: "id1",
          name: null,
          url: null,
          imageUrl: null,
        },
      ],
    } as unknown,
  );
});

test("update user from resource owner with null values", async (ctx) => {
  ctx.mock.timers.enable({ apis: ["Date"], now });

  const email = "example1@keybr.com";

  await User.query().insertGraph({
    email: email,
    name: "name1",
    createdAt: now,
  });

  deepEqual(
    (
      await User.ensure({
        raw: {},
        provider: "provider1",
        id: "id1",
        email: email,
        name: null,
        url: null,
        imageUrl: null,
      })
    ).toJSON(),
    {
      id: 4,
      createdAt: now,
      email: email,
      name: "name1",
      anonymized: 0,
      externalIds: [
        {
          id: 4,
          userId: 4,
          createdAt: now,
          provider: "provider1",
          externalId: "id1",
          name: null,
          url: null,
          imageUrl: null,
        },
      ],
      order: null,
    } as unknown,
  );
});

test("update user from resource owner with non-null values", async (ctx) => {
  ctx.mock.timers.enable({ apis: ["Date"], now });

  const email = "example1@keybr.com";

  await User.query().insertGraph({
    email: email,
    name: "name1",
    createdAt: now,
  });

  deepEqual(
    (
      await User.ensure({
        raw: {},
        provider: "provider1",
        id: "id1",
        email: email,
        name: "name1",
        url: "url1",
        imageUrl: "imageUrl1",
      })
    ).toJSON(),
    {
      id: 4,
      createdAt: now,
      email: email,
      name: "name1",
      anonymized: 0,
      externalIds: [
        {
          id: 4,
          userId: 4,
          createdAt: now,
          provider: "provider1",
          externalId: "id1",
          name: "name1",
          url: "url1",
          imageUrl: "imageUrl1",
        },
      ],
      order: null,
    } as unknown,
  );

  deepEqual(
    (
      await User.ensure({
        raw: {},
        provider: "provider1",
        id: "id1",
        email: email,
        name: "name1!",
        url: "url1!",
        imageUrl: "imageUrl1!",
      })
    ).toJSON(),
    {
      id: 4,
      createdAt: now,
      email: email,
      name: "name1!",
      anonymized: 0,
      externalIds: [
        {
          id: 4,
          userId: 4,
          createdAt: now,
          provider: "provider1",
          externalId: "id1",
          name: "name1!",
          url: "url1!",
          imageUrl: "imageUrl1!",
        },
      ],
      order: null,
    } as unknown,
  );
});

test("update user from resource owner with invalid values", async (ctx) => {
  ctx.mock.timers.enable({ apis: ["Date"], now });

  const email = "example1@keybr.com";

  await User.query().insertGraph({
    email: email,
    name: "name1",
    createdAt: now,
  });

  deepEqual(
    (
      await User.ensure({
        raw: {},
        provider: "provider1",
        id: "id1",
        email: email,
        name: "name1",
        url: "url1",
        imageUrl: "imageUrl1",
      })
    ).toJSON(),
    {
      id: 4,
      createdAt: now,
      email: email,
      name: "name1",
      anonymized: 0,
      externalIds: [
        {
          id: 4,
          userId: 4,
          createdAt: now,
          provider: "provider1",
          externalId: "id1",
          name: "name1",
          url: "url1",
          imageUrl: "imageUrl1",
        },
      ],
      order: null,
    } as unknown,
  );

  deepEqual(
    (
      await User.ensure({
        raw: {},
        provider: "provider1",
        id: "id1",
        email: email,
        name: "name1!",
        url: "x".repeat(1000),
        imageUrl: "x".repeat(1000),
      })
    ).toJSON(),
    {
      id: 4,
      createdAt: now,
      email: email,
      name: "name1!",
      anonymized: 0,
      externalIds: [
        {
          id: 4,
          userId: 4,
          createdAt: now,
          provider: "provider1",
          externalId: "id1",
          name: "name1!",
          url: "url1",
          imageUrl: "imageUrl1",
        },
      ],
      order: null,
    } as unknown,
  );
});

test("merge multiple resource owners", async (ctx) => {
  ctx.mock.timers.enable({ apis: ["Date"], now });

  const email = "example1@keybr.com";

  deepEqual(
    (
      await User.ensure({
        raw: {},
        provider: "provider1",
        id: "id1",
        email: email,
        name: "name1",
        url: "url1",
        imageUrl: "imageUrl1",
      })
    ).toJSON(),
    {
      id: 4,
      createdAt: now,
      email: email,
      name: "name1",
      anonymized: 0,
      externalIds: [
        {
          id: 4,
          userId: 4,
          createdAt: now,
          provider: "provider1",
          externalId: "id1",
          name: "name1",
          url: "url1",
          imageUrl: "imageUrl1",
        },
      ],
      // order: null,
    } as unknown,
  );

  deepEqual(
    (
      await User.ensure({
        raw: {},
        provider: "provider2",
        id: "id2",
        email: email,
        name: "name2",
        url: "url2",
        imageUrl: "imageUrl2",
      })
    ).toJSON(),
    {
      id: 4,
      createdAt: now,
      email: email,
      name: "name2",
      anonymized: 0,
      externalIds: [
        {
          id: 4,
          userId: 4,
          createdAt: now,
          provider: "provider1",
          externalId: "id1",
          name: "name1",
          url: "url1",
          imageUrl: "imageUrl1",
        },
        {
          id: 5,
          userId: 4,
          createdAt: now,
          provider: "provider2",
          externalId: "id2",
          name: "name2",
          url: "url2",
          imageUrl: "imageUrl2",
        },
      ],
      order: null,
    } as unknown,
  );
});

test.skip("handle email change", async (ctx) => {
  ctx.mock.timers.enable({ apis: ["Date"], now });

  deepEqual(
    (
      await User.ensure({
        raw: {},
        provider: "provider1",
        id: "id1",
        email: "example1@keybr.com",
        name: "name1",
        url: "url1",
        imageUrl: "imageUrl1",
      })
    ).toJSON(),
    {
      id: 4,
      createdAt: now,
      email: "example1@keybr.com",
      name: "name1",
      externalIds: [
        {
          id: 4,
          userId: 4,
          createdAt: now,
          provider: "provider1",
          externalId: "id1",
          name: "name1",
          url: "url1",
          imageUrl: "imageUrl1",
        },
      ],
      order: null,
    } as unknown,
  );

  deepEqual(
    (
      await User.ensure({
        raw: {},
        provider: "provider1",
        id: "id1",
        email: "changed@keybr.com",
        name: "name1",
        url: "url1",
        imageUrl: "imageUrl1",
      })
    ).toJSON(),
    {
      id: 4,
      createdAt: now,
      email: "changed@keybr.com",
      name: "name1",
      externalIds: [
        {
          id: 4,
          userId: 4,
          createdAt: now,
          provider: "provider1",
          externalId: "id1",
          name: "name1",
          url: "url1",
          imageUrl: "imageUrl1",
        },
      ],
      order: null,
    } as unknown,
  );
});

test("generates unique name for resource owner", async (ctx) => {
  ctx.mock.timers.enable({ apis: ["Date"], now });

  await User.query().insertGraph({
    email: "example1@keybr.com",
    name: "name",
    createdAt: now,
  });

  deepEqual(
    (
      await User.ensure({
        raw: {},
        provider: "provider2",
        id: "id2",
        email: "example2@keybr.com",
        name: "name",
        url: null,
        imageUrl: null,
      })
    ).toJSON(),
    {
      id: 5,
      createdAt: now,
      email: "example2@keybr.com",
      name: "name1",
      anonymized: 0,
      externalIds: [
        {
          id: 4,
          userId: 5,
          createdAt: now,
          provider: "provider2",
          externalId: "id2",
          name: "name",
          url: null,
          imageUrl: null,
        },
      ],
      // order: null,
    } as unknown,
  );
});

test("make premium user", async (ctx) => {
  ctx.mock.timers.enable({ apis: ["Date"], now });

  const user = await User.query().insertGraph({
    email: "user0@keybr.com",
    name: "user0",
    externalIds: [],
  });

  like(User.toPublicUser(await User.findById(user.id!), ""), {
    premium: false,
  });

  await user.$relatedQuery("order").insert({
    provider: "paddle",
    id: "order id",
    createdAt: now,
    name: null,
    email: null,
  });

  like(User.toPublicUser(await User.findById(user.id!), ""), {
    premium: true,
  });
});

test("create access token", async (ctx) => {
  ctx.mock.timers.enable({ apis: ["Date"], now });

  // Should create a new access token.

  Random.string = () => "token1";
  equal(await UserLoginRequest.init("example1@keybr.com"), "token1");
  isNull(await User.findByEmail("example1@keybr.com"));
  deepEqual(
    (await UserLoginRequest.findByEmail("example1@keybr.com"))!.toJSON(),
    {
      id: 1,
      email: "example1@keybr.com",
      accessToken: "token1",
      createdAt: now,
    },
  );

  // Should reuse an existing access token.

  Random.string = () => "tokenX";
  equal(await UserLoginRequest.init("example1@keybr.com"), "token1");
  equal(await User.findByEmail("example1@keybr.com"), null);
  deepEqual(
    (await UserLoginRequest.findByEmail("example1@keybr.com"))!.toJSON(),
    {
      id: 1,
      email: "example1@keybr.com",
      accessToken: "token1",
      createdAt: now,
    },
  );
});

test("delete expired access token", async (ctx) => {
  ctx.mock.timers.enable({ apis: ["Date"], now });

  Random.string = () => "token1";
  equal(await UserLoginRequest.init("example1@keybr.com"), "token1");

  isNotNull(await UserLoginRequest.findByEmail("example1@keybr.com"));
  isNotNull(await UserLoginRequest.findByAccessToken("token1"));

  await UserLoginRequest.deleteExpired(
    now.getTime() + UserLoginRequest.expireTime + 1000,
  );

  isNull(await UserLoginRequest.findByEmail("example1@keybr.com"));
  isNull(await UserLoginRequest.findByAccessToken("token1"));
});

test("login with a valid access token", async (ctx) => {
  ctx.mock.timers.enable({ apis: ["Date"], now });

  Random.string = () => "token1";

  // Should create a new access token.

  equal(await UserLoginRequest.init("example1@keybr.com"), "token1");

  // Before the first login.

  isNull(await User.findByEmail("example1@keybr.com"));
  isNotNull(await UserLoginRequest.findByEmail("example1@keybr.com"));

  // First login.

  deepEqual((await UserLoginRequest.login("token1"))!.toJSON(), {
    id: 4,
    createdAt: now,
    email: "example1@keybr.com",
    name: "example1",
    anonymized: 0,
    externalIds: [],
    order: null,
  } as unknown);

  // Should create a new user after login.

  isNotNull(await User.findByEmail("example1@keybr.com"));
  isNotNull(await UserLoginRequest.findByEmail("example1@keybr.com"));

  // Second login.

  deepEqual((await UserLoginRequest.login("token1"))!.toJSON(), {
    id: 4,
    createdAt: now,
    email: "example1@keybr.com",
    name: "example1",
    anonymized: 0,
    externalIds: [],
    order: null,
  } as unknown);

  // Should load an existing user after login.

  isNotNull(await User.findByEmail("example1@keybr.com"));
  isNotNull(await UserLoginRequest.findByEmail("example1@keybr.com"));
});

test("ignore invalid access token", async (ctx) => {
  ctx.mock.timers.enable({ apis: ["Date"], now });

  Random.string = () => "token1";

  isNull(await UserLoginRequest.login("token1"));
  isNull(await UserLoginRequest.login("abc"));
  isNull(await UserLoginRequest.login("xyz"));
});

test("access token should be case-sensitive", async (ctx) => {
  ctx.mock.timers.enable({ apis: ["Date"], now });

  await UserLoginRequest.query().insertGraph({
    email: "test@keybr.com",
    accessToken: "token",
    createdAt: now,
  });

  isNotNull(await UserLoginRequest.findByAccessToken("token"));
  isNull(await UserLoginRequest.findByAccessToken("TOKEN"));
});

test("load profile owner", async (ctx) => {
  ctx.mock.timers.enable({ apis: ["Date"], now });

  isNull(await User.loadProfileOwner(new PublicId(999)));
  deepEqual(await User.loadProfileOwner(PublicId.of("example1")), {
    id: "example1",
    name: "Example User 1",
    imageUrl: null,
    premium: false,
  });
  deepEqual(await User.loadProfileOwner(new PublicId(1)), {
    id: "55vdtk1",
    name: "externalName1",
    imageUrl: "imageUrl1",
    premium: false,
  });
});

test("convert to user details", async (ctx) => {
  ctx.mock.timers.enable({ apis: ["Date"], now });

  deepEqual((await User.findByEmail("user1@keybr.com"))?.toDetails(), {
    id: "55vdtk1",
    email: "user1@keybr.com",
    name: "user1",
    anonymized: false,
    externalId: [
      {
        provider: "provider1",
        id: "externalId1",
        name: "externalName1",
        url: "url1",
        imageUrl: "imageUrl1",
        createdAt: new Date("2001-02-03T04:05:06Z"),
      },
    ],
    order: null,
    createdAt: now,
  });
});

test("make public user for anonymous", (ctx) => {
  ctx.mock.timers.enable({ apis: ["Date"], now });

  deepEqual(User.toPublicUser(null, "hint1"), {
    id: null,
    name: "Suspicious Silverfish",
    imageUrl: null,
  });
  deepEqual(User.toPublicUser(null, "hint2"), {
    id: null,
    name: "Suspicious Skink",
    imageUrl: null,
  });
});

test("make public user from user name", (ctx) => {
  ctx.mock.timers.enable({ apis: ["Date"], now });

  deepEqual(
    User.toPublicUser(
      User.fromJson({
        id: 1,
        email: "email",
        name: "somebody",
        anonymized: 0,
        externalIds: [],
        createdAt: new Date(0),
      }),
      0,
    ),
    {
      id: "55vdtk1",
      name: "somebody",
      imageUrl: null,
      premium: false,
    },
  );
});

test("make public user from external user id", (ctx) => {
  ctx.mock.timers.enable({ apis: ["Date"], now });

  deepEqual(
    User.toPublicUser(
      User.fromJson({
        id: 1,
        email: "email",
        name: "somebody",
        anonymized: 0,
        externalIds: [
          {
            id: 1,
            provider: "provider",
            externalId: "externalId",
            name: null,
            url: null,
            imageUrl: null,
            createdAt: new Date(0),
          },
        ],
        createdAt: new Date(0),
      }),
      0,
    ),
    {
      id: "55vdtk1",
      name: "somebody",
      imageUrl: null,
      premium: false,
    },
  );
  deepEqual(
    User.toPublicUser(
      User.fromJson({
        id: 1,
        email: "email",
        name: "somebody",
        anonymized: 0,
        externalIds: [
          {
            id: 1,
            provider: "provider",
            externalId: "externalId",
            name: "xyz",
            url: "url",
            imageUrl: "imageUrl",
            createdAt: new Date(0),
          },
        ],
        createdAt: new Date(0),
      }),
      0,
    ),
    {
      id: "55vdtk1",
      name: "xyz",
      imageUrl: "imageUrl",
      premium: false,
    },
  );
});

test("make public user with anonymous name", (ctx) => {
  ctx.mock.timers.enable({ apis: ["Date"], now });

  deepEqual(
    User.toPublicUser(
      User.fromJson({
        id: 1,
        email: "email1",
        name: "somebody",
        anonymized: 1,
        externalIds: [],
        createdAt: new Date(0),
      }),
      0,
    ),
    {
      id: "55vdtk1",
      name: "Distinctive Vulture",
      imageUrl: null,
      premium: false,
    },
  );
  deepEqual(
    User.toPublicUser(
      User.fromJson({
        id: 1,
        email: "email2",
        name: "somebody",
        anonymized: 1,
        externalIds: [],
        createdAt: new Date(0),
      }),
      0,
    ),
    {
      id: "55vdtk1",
      name: "Distinctive Wallaby",
      imageUrl: null,
      premium: false,
    },
  );
});

test("parse resource owner", (ctx) => {
  ctx.mock.timers.enable({ apis: ["Date"], now });

  deepEqual(
    User.parseResourceOwner({
      raw: { x: 1 },
      provider: "provider1",
      id: "id1",
      email: "email1",
      name: "name1",
      url: "url1",
      imageUrl: "imageUrl",
    }),
    {
      raw: { x: 1 },
      provider: "provider1",
      id: "id1",
      email: "email1",
      name: "name1",
      url: "url1",
      imageUrl: "imageUrl",
    },
  );
  deepEqual(
    User.parseResourceOwner({
      raw: { x: 1 },
      provider: "provider1",
      id: "id1",
      email: null,
      name: null,
      url: null,
      imageUrl: null,
    }),
    {
      raw: { x: 1 },
      provider: "provider1",
      id: "id1",
      email: null,
      name: null,
      url: null,
      imageUrl: null,
    },
  );
  deepEqual(
    User.parseResourceOwner({
      raw: { x: 1 },
      provider: "provider1",
      id: "id1",
      email: "x".repeat(67),
      name: "x".repeat(33),
      url: "x".repeat(257),
      imageUrl: "x".repeat(257),
    }),
    {
      raw: { x: 1 },
      provider: "provider1",
      id: "id1",
      email: null,
      name: "x".repeat(32),
      url: null,
      imageUrl: null,
    },
  );
});
