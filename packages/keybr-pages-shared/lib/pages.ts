import { defaultLocale } from "@keybr/intl";
import {
  mdiCarSide,
  mdiChartAreaspline,
  mdiHelpCircleOutline,
  mdiKeyboard,
  mdiKeyboardOutline,
  mdiSpeedometer,
  mdiTrophyOutline,
} from "@mdi/js";
import { defineMessage, type MessageDescriptor } from "react-intl";
import { type AnonymousUser, type AnyUser, type NamedUser } from "./types.ts";

export type Meta = {
  readonly name?: string;
  readonly property?: string;
  readonly content: string | MessageDescriptor;
};

export type PageInfo = {
  readonly path: string;
  readonly title: MessageDescriptor;
  readonly link: {
    readonly label: MessageDescriptor;
    readonly title?: MessageDescriptor;
    readonly icon?: string;
  };
  readonly meta: Meta[];
};

export namespace Pages {
  const meta: Meta[] = [
    { property: "fb:app_id", content: "545353762151265" },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://www.keybr.com/" },
    { property: "og:site_name", content: "keybr.com - Typing lessons" },
    { property: "og:title", content: "keybr.com - Typing lessons" },
    {
      property: "og:description",
      content:
        "Teaching the world to type at the speed of thought! Typing lessons that work.",
    },
    { property: "og:image", content: "https://www.keybr.com/cover.png" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:site", content: "@keybrcom" },
    { name: "twitter:creator", content: "@keybrcom" },
  ];

  export const account = {
    path: "/account",
    title: defineMessage({
      id: "page.account.title",
      defaultMessage: "Account",
    }),
    link: {
      label: defineMessage({
        id: "page.account.title",
        defaultMessage: "Account",
      }),
    },
    meta: [{ name: "robots", content: "noindex" }],
  } satisfies PageInfo;

  export const practice = {
    path: "/",
    title: defineMessage({
      id: "page.practice.title",
      defaultMessage: "Typing Practice",
    }),
    link: {
      label: defineMessage({
        id: "page.practice.link.name",
        defaultMessage: "Practice",
      }),
      title: defineMessage({
        id: "page.practice.link.description",
        defaultMessage: "Practice typing lessons to improve your typing speed.",
      }),
      icon: mdiKeyboard,
    },
    meta: [
      ...meta,
      {
        name: "description",
        content: defineMessage({
          id: "page.practice.description",
          defaultMessage:
            "Take a typing speed and accuracy test, practice typing lessons, learn to type faster.",
        }),
      },
    ],
  } satisfies PageInfo;

  export const profile = {
    path: "/profile",
    title: defineMessage({
      id: "page.profile.title",
      defaultMessage: "Profile",
    }),
    link: {
      label: defineMessage({
        id: "page.profile.link.name",
        defaultMessage: "Profile",
      }),
      title: defineMessage({
        id: "page.profile.link.description",
        defaultMessage:
          "See the detailed statistics about your learning progress.",
      }),
      icon: mdiChartAreaspline,
    },
    meta: [{ name: "robots", content: "noindex" }],
  } satisfies PageInfo;

  export const help = {
    path: "/help",
    title: defineMessage({
      id: "page.help.title",
      defaultMessage: "Help",
    }),
    link: {
      label: defineMessage({
        id: "page.help.link.name",
        defaultMessage: "Help",
      }),
      title: defineMessage({
        id: "page.help.link.description",
        defaultMessage: "Get the instructions on how to use this application.",
      }),
      icon: mdiHelpCircleOutline,
    },
    meta: [
      ...meta,
      {
        name: "description",
        content: defineMessage({
          id: "page.help.description",
          defaultMessage: "Learn to type faster.",
        }),
      },
    ],
  } satisfies PageInfo;

  export const highScores = {
    path: "/high-scores",
    title: defineMessage({
      id: "page.highScores.title",
      defaultMessage: "High Scores",
    }),
    link: {
      label: defineMessage({
        id: "page.highScores.link.name",
        defaultMessage: "High Scores",
      }),
      title: defineMessage({
        id: "page.highScores.link.description",
        defaultMessage:
          "See the high score table featuring the fastest typists.",
      }),
      icon: mdiTrophyOutline,
    },
    meta: [
      ...meta,
      {
        name: "description",
        content: defineMessage({
          id: "page.highScores.description",
          defaultMessage: "The table of users ranked by their typing speed.",
        }),
      },
    ],
  } satisfies PageInfo;

  export const multiplayer = {
    path: "/multiplayer",
    title: defineMessage({
      id: "page.multiplayer.title",
      defaultMessage: "Multiplayer",
    }),
    link: {
      label: defineMessage({
        id: "page.multiplayer.link.name",
        defaultMessage: "Multiplayer",
      }),
      title: defineMessage({
        id: "page.multiplayer.link.description",
        defaultMessage:
          "Compete against other players in an online multiplayer game.",
      }),
      icon: mdiCarSide,
    },
    meta: [
      ...meta,
      {
        name: "description",
        content: defineMessage({
          id: "page.multiplayer.description",
          defaultMessage: "Online multiplayer type racing game.",
        }),
      },
    ],
  } satisfies PageInfo;

  export const typingTest = {
    path: "/typing-test",
    title: defineMessage({
      id: "page.typingTest.title",
      defaultMessage: "Typing Speed and Accuracy Test",
    }),
    link: {
      label: defineMessage({
        id: "page.typingTest.link.name",
        defaultMessage: "Typing Test",
      }),
      title: defineMessage({
        id: "page.typingTest.link.description",
        defaultMessage: "Take a typing speed test.",
      }),
      icon: mdiSpeedometer,
    },
    meta: [
      ...meta,
      {
        name: "description",
        content: defineMessage({
          id: "page.typingTest.description",
          defaultMessage: "Take a typing speed and accuracy test.",
        }),
      },
    ],
  } satisfies PageInfo;

  export const layouts = {
    path: "/layouts",
    title: defineMessage({
      id: "page.layouts.title",
      defaultMessage: "Keyboard Layouts",
    }),
    link: {
      label: defineMessage({
        id: "page.layouts.link.name",
        defaultMessage: "Layouts",
      }),
      title: defineMessage({
        id: "page.layouts.link.description",
        defaultMessage: "Compare the efficiency of different keyboard layouts.",
      }),
      icon: mdiKeyboardOutline,
    },
    meta: [
      ...meta,
      {
        name: "description",
        content: defineMessage({
          id: "page.layouts.description",
          defaultMessage: "Keyboard layouts comparison charts.",
        }),
      },
    ],
  } satisfies PageInfo;

  export const termsOfService = {
    path: "/terms-of-service",
    title: defineMessage({
      id: "page.termsOfService.name",
      defaultMessage: "Terms of Service",
    }),
    link: {
      label: defineMessage({
        id: "page.termsOfService.name",
        defaultMessage: "Terms of Service",
      }),
    },
    meta: [{ name: "robots", content: "noindex" }],
  } satisfies PageInfo;

  export const privacyPolicy = {
    path: "/privacy-policy",
    title: defineMessage({
      id: "page.privacyPolicy.name",
      defaultMessage: "Privacy Policy",
    }),
    link: {
      label: defineMessage({
        id: "page.privacyPolicy.name",
        defaultMessage: "Privacy Policy",
      }),
    },
    meta: [{ name: "robots", content: "noindex" }],
  } satisfies PageInfo;

  export function profileOf(arg: string): string;
  export function profileOf(arg: NamedUser): string;
  export function profileOf(arg: AnonymousUser): null;
  export function profileOf(arg: AnyUser): string | null;
  export function profileOf(arg: null): null;
  export function profileOf(arg: any): string | null {
    if (arg == null) {
      return null;
    }
    if (typeof arg === "string") {
      return `${Pages.profile.path}/${arg}`;
    }
    if (typeof arg === "object" && typeof arg.id === "string") {
      return `${Pages.profile.path}/${arg.id}`;
    }
    return null;
  }

  export function intlBase(locale: string): string {
    return locale === defaultLocale ? "" : `/${locale}`;
  }

  export function intlPath(path: string, locale: string): string {
    return locale === defaultLocale
      ? path
      : path === "/"
        ? `/${locale}`
        : `/${locale}${path}`;
  }
}
