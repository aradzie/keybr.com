import { type Binder, inject, type Module, provides } from "@fastr/invert";
import { Env } from "@keybr/config";
import {
  type AbstractAdapter,
  FacebookAdapter,
  GoogleAdapter,
  MicrosoftAdapter,
} from "@keybr/oauth";

export abstract class AdapterFactory {
  abstract makeAdapter(redirectUri: string): AbstractAdapter;
}

export class AuthModule implements Module {
  configure({ bind }: Binder): void {}

  @provides({ id: AdapterFactory, name: "google", singleton: true })
  provideGoogleAdapter(
    @inject("canonicalUrl") canonicalUrl: string,
  ): AdapterFactory {
    const clientId = Env.getString("AUTH_GOOGLE_CLIENT_ID");
    const clientSecret = Env.getString("AUTH_GOOGLE_CLIENT_SECRET");
    const scope = ["email", "profile"].join(" ");
    return new (class GoogleAdapterFactory extends AdapterFactory {
      makeAdapter(redirectUri: string): AbstractAdapter {
        return new GoogleAdapter({
          clientId,
          clientSecret,
          scope,
          redirectUri: String(new URL(redirectUri, canonicalUrl)),
        });
      }
    })();
  }

  @provides({ id: AdapterFactory, name: "microsoft", singleton: true })
  provideMicrosoftAdapter(
    @inject("canonicalUrl") canonicalUrl: string,
  ): AdapterFactory {
    const clientId = Env.getString("AUTH_MICROSOFT_CLIENT_ID");
    const clientSecret = Env.getString("AUTH_MICROSOFT_CLIENT_SECRET");
    const scope = ["https://graph.microsoft.com/User.Read"].join(" ");
    return new (class MicrosoftAdapterFactory extends AdapterFactory {
      makeAdapter(redirectUri: string): AbstractAdapter {
        return new MicrosoftAdapter({
          clientId,
          clientSecret,
          scope,
          redirectUri: String(new URL(redirectUri, canonicalUrl)),
        });
      }
    })();
  }

  @provides({ id: AdapterFactory, name: "facebook", singleton: true })
  provideFacebookAdapter(
    @inject("canonicalUrl") canonicalUrl: string,
  ): AdapterFactory {
    const clientId = Env.getString("AUTH_FACEBOOK_CLIENT_ID");
    const clientSecret = Env.getString("AUTH_FACEBOOK_CLIENT_SECRET");
    const scope = ["email", "public_profile"].join(",");
    return new (class FacebookAdapterFactory extends AdapterFactory {
      makeAdapter(redirectUri: string): AbstractAdapter {
        return new FacebookAdapter({
          clientId,
          clientSecret,
          scope,
          redirectUri: String(new URL(redirectUri, canonicalUrl)),
        });
      }
    })();
  }
}
