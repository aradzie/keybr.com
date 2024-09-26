import { CookieDeclaration } from "@keybr/thirdparties";
import { Article } from "@keybr/widget";
import { type ReactNode } from "react";
import privacyPolicyHtml from "./privacy-policy.html.ts";
import termsOfServiceHtml from "./terms-of-service.html.ts";

export function PrivacyPolicyPage(): ReactNode {
  return (
    <Article>
      <div
        dangerouslySetInnerHTML={{
          __html: privacyPolicyHtml,
        }}
      />
      <h1>Cookie Declaration</h1>
      <CookieDeclaration />
    </Article>
  );
}

export function TermsOfServicePage(): ReactNode {
  return (
    <Article>
      <div
        dangerouslySetInnerHTML={{
          __html: termsOfServiceHtml,
        }}
      />
    </Article>
  );
}
