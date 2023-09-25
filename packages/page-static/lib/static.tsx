import { StandardLayout } from "@keybr/pages-server";
import { Sitemap } from "@keybr/pages-shared";
import { CookieDeclaration } from "@keybr/thirdparties";
import { Article } from "@keybr/widget";
import { type ReactNode } from "react";
import privacyPolicyHtml from "./privacy-policy.html.ts";
import termsOfServiceHtml from "./terms-of-service.html.ts";

export function PrivacyPolicyPage(): ReactNode {
  return (
    <StandardLayout
      pageMeta={{
        pageLink: Sitemap.privacyPolicy.bind(null),
        title: "Privacy Policy",
        description: "Privacy policy",
        entrypoint: "page-static",
      }}
    >
      <Article>
        <div
          dangerouslySetInnerHTML={{
            __html: privacyPolicyHtml,
          }}
        />
        <h1>Cookie Declaration</h1>
        <CookieDeclaration />
      </Article>
    </StandardLayout>
  );
}

export function TermsOfServicePage(): ReactNode {
  return (
    <StandardLayout
      pageMeta={{
        pageLink: Sitemap.termsOfService.bind(null),
        title: "Terms of Service",
        description: "Terms of service",
        entrypoint: "page-static",
      }}
    >
      <Article>
        <div
          dangerouslySetInnerHTML={{
            __html: termsOfServiceHtml,
          }}
        />
      </Article>
    </StandardLayout>
  );
}
