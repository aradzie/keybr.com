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
      id: "nav.signInName",
      description: "Navigation menu item name.",
      defaultMessage: "Sign-In",
    }),
    title: defineMessage({
      id: "nav.signInTitle",
      description: "Navigation menu item title.",
      defaultMessage: "Sign‑in for an online account.",
    }),
    icon: AccountIcon,
  });

  static readonly account = new PageLinkTemplate<NamedUser>({
    path: "/account",
    name: defineMessage({
      id: "nav.accountName",
      description: "Navigation menu item name.",
      defaultMessage: "{name}",
    }),
    title: defineMessage({
      id: "nav.accountTitle",
      description: "Navigation menu item title.",
      defaultMessage: "Manage your online account.",
    }),
    icon: AccountIcon,
  });

  static readonly practice = new PageLinkTemplate({
    path: "/",
    name: defineMessage({
      id: "nav.practiceName",
      description: "Navigation menu item name.",
      defaultMessage: "Practice",
    }),
    title: defineMessage({
      id: "nav.practiceTitle",
      description: "Navigation menu item title.",
      defaultMessage: "Practice typing lessons to improve your typing speed.",
    }),
    icon: PracticeIcon,
  });

  static readonly profile = new PageLinkTemplate({
    path: "/profile",
    name: defineMessage({
      id: "nav.profileName",
      description: "Navigation menu item name.",
      defaultMessage: "Profile",
    }),
    title: defineMessage({
      id: "nav.profileTitle",
      description: "Navigation menu item title.",
      defaultMessage:
        "See the detailed statistics about your learning progress.",
    }),
    icon: ProfileIcon,
  });

  static readonly typingTest = new PageLinkTemplate({
    path: "/typing-test",
    name: defineMessage({
      id: "nav.typingTestName",
      description: "Navigation menu item name.",
      defaultMessage: "Typing Test",
    }),
    title: defineMessage({
      id: "nav.typingTestTitle",
      description: "Navigation menu item title.",
      defaultMessage: "Take a typing speed test.",
    }),
    icon: TypingTestIcon,
  });

  static readonly help = new PageLinkTemplate({
    path: "/help",
    name: defineMessage({
      id: "nav.helpName",
      description: "Navigation menu item name.",
      defaultMessage: "Help",
    }),
    title: defineMessage({
      id: "nav.helpTitle",
      description: "Navigation menu item title.",
      defaultMessage: "Get the instructions on how to use this application.",
    }),
    icon: HelpIcon,
  });

  static readonly publicProfile = new PageLinkTemplate<NamedUser>({
    path: "/profile/:id",
    name: defineMessage({
      id: "nav.publicProfileName",
      description: "Navigation menu item name.",
      defaultMessage: "Public Profile of {name}",
    }),
    title: defineMessage({
      id: "nav.publicProfileTitle",
      description: "Navigation menu item title.",
      defaultMessage: "Observe the public profile of user {name}.",
    }),
    icon: ProfileIcon,
  });

  static readonly highScores = new PageLinkTemplate({
    path: "/high-scores",
    name: defineMessage({
      id: "nav.highScoresName",
      description: "Navigation menu item name.",
      defaultMessage: "High Scores",
    }),
    title: defineMessage({
      id: "nav.highScoresTitle",
      description: "Navigation menu item title.",
      defaultMessage: "See the high score table featuring the fastest typists.",
    }),
    icon: HighScoresIcon,
  });

  static readonly multiplayer = new PageLinkTemplate({
    path: "/multiplayer",
    name: defineMessage({
      id: "nav.multiplayerName",
      description: "Navigation menu item name.",
      defaultMessage: "Multiplayer",
    }),
    title: defineMessage({
      id: "nav.multiplayerTitle",
      description: "Navigation menu item title.",
      defaultMessage:
        "Compete against other players in an online multiplayer game.",
    }),
    icon: MultiplayerIcon,
  });

  static readonly layouts = new PageLinkTemplate({
    path: "/layouts",
    name: defineMessage({
      id: "nav.layoutsName",
      description: "Navigation menu item name.",
      defaultMessage: "Layouts",
    }),
    title: defineMessage({
      id: "nav.layoutsTitle",
      description: "Navigation menu item title.",
      defaultMessage: "Compare the efficiency of different keyboard layouts.",
    }),
    icon: LayoutsIcon,
  });

  static readonly textTools = new PageLinkTemplate({
    path: "/text-tools",
    name: defineMessage({
      id: "nav.textToolsName",
      description: "Navigation menu item name.",
      defaultMessage: "Text Tools",
    }),
    title: defineMessage({
      id: "nav.textToolsTitle",
      description: "Navigation menu item title.",
      defaultMessage: "Count the characters and words in your text.",
    }),
    icon: TextToolsIcon,
  });

  static readonly privacyPolicy = new PageLinkTemplate({
    path: "/privacy-policy",
    name: defineMessage({
      id: "nav.privacyPolicyName",
      description: "Navigation menu item name.",
      defaultMessage: "Privacy Policy",
    }),
    title: defineMessage({
      id: "nav.privacyPolicyTitle",
      description: "Navigation menu item title.",
      defaultMessage: "Privacy policy.",
    }),
  });

  static readonly termsOfService = new PageLinkTemplate({
    path: "/terms-of-service",
    name: defineMessage({
      id: "nav.termsOfServiceName",
      description: "Navigation menu item name.",
      defaultMessage: "Terms of Service",
    }),
    title: defineMessage({
      id: "nav.termsOfServiceTitle",
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
