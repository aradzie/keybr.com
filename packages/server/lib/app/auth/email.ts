import { type Mailer } from "../mail/index.ts";

export function messageWithLink({
  email,
  link,
}: {
  readonly email: string;
  readonly link: string;
}): Mailer.Message {
  const subject = `Login link for keybr.com`;
  const text = `Hello, keybr.com user!

Here is the link to log you in into the web-site: ${link}

Please keep this link secret and don't share it with anybody!

We wish you happy typing!
`;
  return {
    to: email,
    subject,
    text,
  };
}
