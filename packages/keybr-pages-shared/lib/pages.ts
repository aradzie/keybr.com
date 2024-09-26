import { defaultLocale } from "@keybr/intl";
import {
  mdiCarSide,
  mdiChartAreaspline,
  mdiHelpCircleOutline,
  mdiKeyboard,
  mdiKeyboardOutline,
  mdiSpeedometer,
  mdiTextBoxCheckOutline,
  mdiTrophyOutline,
} from "@mdi/js";
import { defineMessage, type MessageDescriptor } from "react-intl";
import { type AnonymousUser, type AnyUser, type NamedUser } from "./types.ts";

export namespace Pages {
  export type Meta = {
    readonly path: string;
    readonly meta: {
      readonly title: string | MessageDescriptor;
      readonly description: string | MessageDescriptor;
    };
    readonly link: {
      readonly label: string | MessageDescriptor;
      readonly title: string | MessageDescriptor;
    };
    readonly icon: string;
  };

  export const account = {
    path: "/account",
    meta: {
      title: "Account",
      description: "",
    },
    link: {
      label: "",
      title: "",
    },
    icon: "",
  } satisfies Meta;

  export const practice = {
    path: "/",
    meta: {
      title: defineMessage({
        id: "page.practice.title",
        defaultMessage: "Typing Practice",
      }),
      description: defineMessage({
        id: "page.practice.description",
        defaultMessage:
          "Take a typing test, practice typing lessons, learn to type faster.",
      }),
    },
    link: {
      label: defineMessage({
        id: "page.practice.link.name",
        defaultMessage: "Practice",
      }),
      title: defineMessage({
        id: "page.practice.link.description",
        defaultMessage: "Practice typing lessons to improve your typing speed.",
      }),
    },
    icon: mdiKeyboard,
  } satisfies Meta;

  export const profile = {
    path: "/profile",
    meta: {
      title: defineMessage({
        id: "page.profile.title",
        defaultMessage: "My Profile",
      }),
      description: defineMessage({
        id: "page.profile.description",
        defaultMessage: "My detailed profile.",
      }),
    },
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
    },
    icon: mdiChartAreaspline,
  } satisfies Meta;

  export const help = {
    path: "/help",
    meta: {
      title: defineMessage({
        id: "page.help.title",
        defaultMessage: "Help",
      }),
      description: defineMessage({
        id: "page.help.description",
        defaultMessage: "Learn to type faster.",
      }),
    },
    link: {
      label: defineMessage({
        id: "page.help.link.name",
        defaultMessage: "Help",
      }),
      title: defineMessage({
        id: "page.help.link.description",
        defaultMessage: "Get the instructions on how to use this application.",
      }),
    },
    icon: mdiHelpCircleOutline,
  } satisfies Meta;

  export const highScores = {
    path: "/high-scores",
    meta: {
      title: defineMessage({
        id: "page.highScores.title",
        defaultMessage: "High Scores Table",
      }),
      description: defineMessage({
        id: "page.highScores.description",
        defaultMessage: "The table of users ranked by their typing speed.",
      }),
    },
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
    },
    icon: mdiTrophyOutline,
  } satisfies Meta;

  export const multiplayer = {
    path: "/multiplayer",
    meta: {
      title: defineMessage({
        id: "page.multiplayer.title",
        defaultMessage: "Multiplayer",
      }),
      description: defineMessage({
        id: "page.multiplayer.description",
        defaultMessage: "Online multiplayer type racing game.",
      }),
    },
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
    },
    icon: mdiCarSide,
  } satisfies Meta;

  export const typingTest = {
    path: "/typing-test",
    meta: {
      title: defineMessage({
        id: "page.typingTest.title",
        defaultMessage: "Speed Test",
      }),
      description: defineMessage({
        id: "page.typingTest.description",
        defaultMessage: "Take a typing speed test.",
      }),
    },
    link: {
      label: defineMessage({
        id: "page.typingTest.link.name",
        defaultMessage: "Typing Test",
      }),
      title: defineMessage({
        id: "page.typingTest.link.description",
        defaultMessage: "Take a typing speed test.",
      }),
    },
    icon: mdiSpeedometer,
  } satisfies Meta;

  export const layouts = {
    path: "/layouts",
    meta: {
      title: defineMessage({
        id: "page.layouts.title",
        defaultMessage: "Keyboard Layouts",
      }),
      description: defineMessage({
        id: "page.layouts.description",
        defaultMessage: "Keyboard layouts comparison charts.",
      }),
    },
    link: {
      label: defineMessage({
        id: "page.layouts.link.name",
        defaultMessage: "Layouts",
      }),
      title: defineMessage({
        id: "page.layouts.link.description",
        defaultMessage: "Compare the efficiency of different keyboard layouts.",
      }),
    },
    icon: mdiKeyboardOutline,
  } satisfies Meta;

  export const wordCount = {
    path: "/word-count",
    meta: {
      title: defineMessage({
        id: "page.wordCount.title",
        defaultMessage: "Word Count",
      }),
      description: defineMessage({
        id: "page.wordCount.description",
        defaultMessage: "Count the characters and words in your text.",
      }),
    },
    link: {
      label: defineMessage({
        id: "page.wordCount.link.name",
        defaultMessage: "Word Count",
      }),
      title: defineMessage({
        id: "page.wordCount.link.description",
        defaultMessage: "Count the characters and words in your text.",
      }),
    },
    icon: mdiTextBoxCheckOutline,
  } satisfies Meta;

  export const termsOfService = {
    path: "/terms-of-service",
    meta: {
      title: "Terms of Service",
      description: "Terms of Service",
    },
    link: {
      label: defineMessage({
        id: "page.termsOfService.link.name",
        defaultMessage: "Terms of Service",
      }),
      title: defineMessage({
        id: "page.termsOfService.link.description",
        defaultMessage: "Terms of service.",
      }),
    },
    icon: "",
  } satisfies Meta;

  export const privacyPolicy = {
    path: "/privacy-policy",
    meta: {
      title: "Privacy Policy",
      description: "Privacy Policy",
    },
    link: {
      label: defineMessage({
        id: "page.privacyPolicy.link.name",
        defaultMessage: "Privacy Policy",
      }),
      title: defineMessage({
        id: "page.privacyPolicy.link.description",
        defaultMessage: "Privacy policy.",
      }),
    },
    icon: "",
  } satisfies Meta;

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
