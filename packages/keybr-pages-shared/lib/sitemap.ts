import { defineMessage } from "react-intl";
import {
  AccountIcon,
  HelpIcon,
  HighScoresIcon,
  LayoutsIcon,
  MultiplayerIcon,
  PracticeIcon,
  ProfileIcon,
  TypingTestIcon,
  WordCountIcon,
} from "./icons.tsx";
import { type BoundPageLink, PageLinkTemplate } from "./pagelink.tsx";
import { type AnyUser, type NamedUser } from "./types.ts";

export class Sitemap {
  static readonly signIn = new PageLinkTemplate({
    path: "/account",
    name: defineMessage({
      id: "page.account.anonymous.link.name",
      defaultMessage: "Sign-In",
    }),
    title: defineMessage({
      id: "page.account.anonymous.link.description",
      defaultMessage: "Sign-in for an online account.",
    }),
    icon: AccountIcon,
  });

  static readonly account = new PageLinkTemplate<NamedUser>({
    path: "/account",
    name: defineMessage({
      id: "page.account.named.link.name",
      defaultMessage: "{name}",
    }),
    title: defineMessage({
      id: "page.account.named.link.description",
      defaultMessage: "Manage your online account.",
    }),
    icon: AccountIcon,
  });

  static readonly practice = new PageLinkTemplate({
    path: "/",
    name: defineMessage({
      id: "page.practice.link.name",
      defaultMessage: "Practice",
    }),
    title: defineMessage({
      id: "page.practice.link.description",
      defaultMessage: "Practice typing lessons to improve your typing speed.",
    }),
    icon: PracticeIcon,
  });

  static readonly profile = new PageLinkTemplate({
    path: "/profile",
    name: defineMessage({
      id: "page.profile.link.name",
      defaultMessage: "Profile",
    }),
    title: defineMessage({
      id: "page.profile.link.description",
      defaultMessage:
        "See the detailed statistics about your learning progress.",
    }),
    icon: ProfileIcon,
  });

  static readonly typingTest = new PageLinkTemplate({
    path: "/typing-test",
    name: defineMessage({
      id: "page.typingTest.link.name",
      defaultMessage: "Typing Test",
    }),
    title: defineMessage({
      id: "page.typingTest.link.description",
      defaultMessage: "Take a typing speed test.",
    }),
    icon: TypingTestIcon,
  });

  static readonly help = new PageLinkTemplate({
    path: "/help",
    name: defineMessage({
      id: "page.help.link.name",
      defaultMessage: "Help",
    }),
    title: defineMessage({
      id: "page.help.link.description",
      defaultMessage: "Get the instructions on how to use this application.",
    }),
    icon: HelpIcon,
  });

  static readonly publicProfile = new PageLinkTemplate<NamedUser>({
    path: "/profile/:id",
    name: defineMessage({
      id: "page.publicProfile.link.name",
      defaultMessage: "Public Profile of {name}",
    }),
    title: defineMessage({
      id: "page.publicProfile.link.description",
      defaultMessage: "Observe the public profile of user {name}.",
    }),
    icon: ProfileIcon,
  });

  static readonly highScores = new PageLinkTemplate({
    path: "/high-scores",
    name: defineMessage({
      id: "page.highScores.link.name",
      defaultMessage: "High Scores",
    }),
    title: defineMessage({
      id: "page.highScores.link.description",
      defaultMessage: "See the high score table featuring the fastest typists.",
    }),
    icon: HighScoresIcon,
  });

  static readonly multiplayer = new PageLinkTemplate({
    path: "/multiplayer",
    name: defineMessage({
      id: "page.multiplayer.link.name",
      defaultMessage: "Multiplayer",
    }),
    title: defineMessage({
      id: "page.multiplayer.link.description",
      defaultMessage:
        "Compete against other players in an online multiplayer game.",
    }),
    icon: MultiplayerIcon,
  });

  static readonly layouts = new PageLinkTemplate({
    path: "/layouts",
    name: defineMessage({
      id: "page.layouts.link.name",
      defaultMessage: "Layouts",
    }),
    title: defineMessage({
      id: "page.layouts.link.description",
      defaultMessage: "Compare the efficiency of different keyboard layouts.",
    }),
    icon: LayoutsIcon,
  });

  static readonly wordCount = new PageLinkTemplate({
    path: "/word-count",
    name: defineMessage({
      id: "page.wordCount.link.name",
      defaultMessage: "Word Count",
    }),
    title: defineMessage({
      id: "page.wordCount.link.description",
      defaultMessage: "Count the characters and words in your text.",
    }),
    icon: WordCountIcon,
  });

  static readonly privacyPolicy = new PageLinkTemplate({
    path: "/privacy-policy",
    name: defineMessage({
      id: "page.privacyPolicy.link.name",
      defaultMessage: "Privacy Policy",
    }),
    title: defineMessage({
      id: "page.privacyPolicy.link.description",
      defaultMessage: "Privacy policy.",
    }),
  });

  static readonly termsOfService = new PageLinkTemplate({
    path: "/terms-of-service",
    name: defineMessage({
      id: "page.termsOfService.link.name",
      defaultMessage: "Terms of Service",
    }),
    title: defineMessage({
      id: "page.termsOfService.link.description",
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
    Sitemap.wordCount,
  ];

  static readonly sitemapLinks: readonly PageLinkTemplate[] = [
    Sitemap.practice,
    Sitemap.profile,
    Sitemap.help,
    Sitemap.highScores,
    Sitemap.multiplayer,
    Sitemap.typingTest,
    Sitemap.layouts,
    Sitemap.wordCount,
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
