import { defineMessage } from "react-intl";
import {
  AccountIcon,
  HelpIcon,
  HighScoresIcon,
  LayoutsIcon,
  MultiplayerIcon,
  PracticeIcon,
  ProfileIcon,
  TextToolsIcon,
  TypingTestIcon,
} from "./icons.tsx";
import { type BoundPageLink, PageLinkTemplate } from "./pagelink.tsx";
import { type AnyUser, type NamedUser } from "./types.ts";

export class Sitemap {
  static readonly signIn = new PageLinkTemplate({
    path: "/account",
    name: defineMessage({
      id: "nav.signIn.name",
      description: "Navigation menu item name.",
      defaultMessage: "Sign-In",
    }),
    title: defineMessage({
      id: "nav.signIn.description",
      description: "Navigation menu item title.",
      defaultMessage: "Sign‑in for an online account.",
    }),
    icon: AccountIcon,
  });

  static readonly account = new PageLinkTemplate<NamedUser>({
    path: "/account",
    name: defineMessage({
      id: "nav.account.name",
      description: "Navigation menu item name.",
      defaultMessage: "{name}",
    }),
    title: defineMessage({
      id: "nav.account.description",
      description: "Navigation menu item title.",
      defaultMessage: "Manage your online account.",
    }),
    icon: AccountIcon,
  });

  static readonly practice = new PageLinkTemplate({
    path: "/",
    name: defineMessage({
      id: "nav.practice.name",
      description: "Navigation menu item name.",
      defaultMessage: "Practice",
    }),
    title: defineMessage({
      id: "nav.practice.description",
      description: "Navigation menu item title.",
      defaultMessage: "Practice typing lessons to improve your typing speed.",
    }),
    icon: PracticeIcon,
  });

  static readonly profile = new PageLinkTemplate({
    path: "/profile",
    name: defineMessage({
      id: "nav.profile.name",
      description: "Navigation menu item name.",
      defaultMessage: "Profile",
    }),
    title: defineMessage({
      id: "nav.profile.description",
      description: "Navigation menu item title.",
      defaultMessage:
        "See the detailed statistics about your learning progress.",
    }),
    icon: ProfileIcon,
  });

  static readonly typingTest = new PageLinkTemplate({
    path: "/typing-test",
    name: defineMessage({
      id: "nav.typingTest.name",
      description: "Navigation menu item name.",
      defaultMessage: "Typing Test",
    }),
    title: defineMessage({
      id: "nav.typingTest.description",
      description: "Navigation menu item title.",
      defaultMessage: "Take a typing speed test.",
    }),
    icon: TypingTestIcon,
  });

  static readonly help = new PageLinkTemplate({
    path: "/help",
    name: defineMessage({
      id: "nav.help.name",
      description: "Navigation menu item name.",
      defaultMessage: "Help",
    }),
    title: defineMessage({
      id: "nav.help.description",
      description: "Navigation menu item title.",
      defaultMessage: "Get the instructions on how to use this application.",
    }),
    icon: HelpIcon,
  });

  static readonly publicProfile = new PageLinkTemplate<NamedUser>({
    path: "/profile/:id",
    name: defineMessage({
      id: "nav.publicProfile.name",
      description: "Navigation menu item name.",
      defaultMessage: "Public Profile of {name}",
    }),
    title: defineMessage({
      id: "nav.publicProfile.description",
      description: "Navigation menu item title.",
      defaultMessage: "Observe the public profile of user {name}.",
    }),
    icon: ProfileIcon,
  });

  static readonly highScores = new PageLinkTemplate({
    path: "/high-scores",
    name: defineMessage({
      id: "nav.highScores.name",
      description: "Navigation menu item name.",
      defaultMessage: "High Scores",
    }),
    title: defineMessage({
      id: "nav.highScores.description",
      description: "Navigation menu item title.",
      defaultMessage: "See the high score table featuring the fastest typists.",
    }),
    icon: HighScoresIcon,
  });

  static readonly multiplayer = new PageLinkTemplate({
    path: "/multiplayer",
    name: defineMessage({
      id: "nav.multiplayer.name",
      description: "Navigation menu item name.",
      defaultMessage: "Multiplayer",
    }),
    title: defineMessage({
      id: "nav.multiplayer.description",
      description: "Navigation menu item title.",
      defaultMessage:
        "Compete against other players in an online multiplayer game.",
    }),
    icon: MultiplayerIcon,
  });

  static readonly layouts = new PageLinkTemplate({
    path: "/layouts",
    name: defineMessage({
      id: "nav.layouts.name",
      description: "Navigation menu item name.",
      defaultMessage: "Layouts",
    }),
    title: defineMessage({
      id: "nav.layouts.description",
      description: "Navigation menu item title.",
      defaultMessage: "Compare the efficiency of different keyboard layouts.",
    }),
    icon: LayoutsIcon,
  });

  static readonly textTools = new PageLinkTemplate({
    path: "/text-tools",
    name: defineMessage({
      id: "nav.textTools.name",
      description: "Navigation menu item name.",
      defaultMessage: "Text Tools",
    }),
    title: defineMessage({
      id: "nav.textTools.description",
      description: "Navigation menu item title.",
      defaultMessage: "Count the characters and words in your text.",
    }),
    icon: TextToolsIcon,
  });

  static readonly privacyPolicy = new PageLinkTemplate({
    path: "/privacy-policy",
    name: defineMessage({
      id: "nav.privacyPolicy.name",
      description: "Navigation menu item name.",
      defaultMessage: "Privacy Policy",
    }),
    title: defineMessage({
      id: "nav.privacyPolicy.description",
      description: "Navigation menu item title.",
      defaultMessage: "Privacy policy.",
    }),
  });

  static readonly termsOfService = new PageLinkTemplate({
    path: "/terms-of-service",
    name: defineMessage({
      id: "nav.termsOfService.name",
      description: "Navigation menu item name.",
      defaultMessage: "Terms of Service",
    }),
    title: defineMessage({
      id: "nav.termsOfService.description",
      description: "Navigation menu item title.",
      defaultMessage: "Terms of service.",
    }),
  });

  static readonly menuItems: readonly PageLinkTemplate[] = [
    Sitemap.practice,
    Sitemap.profile,
    Sitemap.help,
    Sitemap.highScores,
    Sitemap.multiplayer,
    Sitemap.typingTest,
    Sitemap.layouts,
    Sitemap.textTools,
  ];

  static readonly sitemapLinks: readonly PageLinkTemplate[] = [
    Sitemap.practice,
    Sitemap.profile,
    Sitemap.help,
    Sitemap.highScores,
    Sitemap.multiplayer,
    Sitemap.typingTest,
    Sitemap.layouts,
    Sitemap.textTools,
    Sitemap.signIn,
    Sitemap.privacyPolicy,
    Sitemap.termsOfService,
  ];

  static accountLink(user: AnyUser): BoundPageLink<any> {
    if (user.id != null) {
      return Sitemap.account.bind(user);
    } else {
      return Sitemap.signIn.bind(null);
    }
  }
}
