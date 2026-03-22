import { test } from "node:test";
import { lessonProps } from "@keybr/lesson";
import { type PageData, PageDataContext } from "@keybr/pages-shared";
import { Settings } from "@keybr/settings";
import { FakeSettingsContext } from "@keybr/settings";
import { renderHook, waitFor } from "@testing-library/react";
import { equal, isNull } from "rich-assert";
import { useUrlCustomText } from "./useUrlCustomText.ts";

function createWrapper(pageData: PageData) {
  return function Wrapper({
    children,
  }: {
    readonly children: React.ReactNode;
  }) {
    return (
      <PageDataContext.Provider value={pageData}>
        <FakeSettingsContext>{children}</FakeSettingsContext>
      </PageDataContext.Provider>
    );
  };
}

test("returns null when no custom text in page data", async () => {
  const mockPageData: PageData = {
    base: "https://example.com",
    locale: "en",
    user: null,
    publicUser: { id: null, name: "Anonymous", imageUrl: null },
    settings: null,
    customText: null,
  };

  const { result } = renderHook(() => useUrlCustomText(), {
    wrapper: createWrapper(mockPageData),
  });

  await waitFor(() => {
    isNull(result.current);
  });
});

test("returns trimmed text when custom text provided", async () => {
  const mockPageData: PageData = {
    base: "https://example.com",
    locale: "en",
    user: null,
    publicUser: { id: null, name: "Anonymous", imageUrl: null },
    settings: null,
    customText: "  Hello World  ",
  };

  const { result } = renderHook(() => useUrlCustomText(), {
    wrapper: createWrapper(mockPageData),
  });

  await waitFor(() => {
    equal(result.current, "Hello World");
  });
});

test("truncates text to max length", async () => {
  const longText = "A".repeat(15000);
  const mockPageData: PageData = {
    base: "https://example.com",
    locale: "en",
    user: null,
    publicUser: { id: null, name: "Anonymous", imageUrl: null },
    settings: null,
    customText: longText,
  };

  const { result } = renderHook(() => useUrlCustomText(), {
    wrapper: createWrapper(mockPageData),
  });

  await waitFor(() => {
    equal(result.current?.length, 10000);
  });
});

test("returns null for empty string", async () => {
  const mockPageData: PageData = {
    base: "https://example.com",
    locale: "en",
    user: null,
    publicUser: { id: null, name: "Anonymous", imageUrl: null },
    settings: null,
    customText: "   ",
  };

  const { result } = renderHook(() => useUrlCustomText(), {
    wrapper: createWrapper(mockPageData),
  });

  await waitFor(() => {
    isNull(result.current);
  });
});

test("returns null for whitespace only", async () => {
  const mockPageData: PageData = {
    base: "https://example.com",
    locale: "en",
    user: null,
    publicUser: { id: null, name: "Anonymous", imageUrl: null },
    settings: null,
    customText: "\t\n\r",
  };

  const { result } = renderHook(() => useUrlCustomText(), {
    wrapper: createWrapper(mockPageData),
  });

  await waitFor(() => {
    isNull(result.current);
  });
});

test("handles special characters from URL encoding", async () => {
  const specialText = "Hello%20World%21%20%40%23%24%25%5E%26%2A%28%29";
  const decodedText = "Hello World! @#$%^&*()";
  const mockPageData: PageData = {
    base: "https://example.com",
    locale: "en",
    user: null,
    publicUser: { id: null, name: "Anonymous", imageUrl: null },
    settings: null,
    customText: decodedText,
  };

  const { result } = renderHook(() => useUrlCustomText(), {
    wrapper: createWrapper(mockPageData),
  });

  await waitFor(() => {
    equal(result.current, decodedText);
  });
});

test("handles unicode and emoji characters", async () => {
  const unicodeText = "Hello 世界 🌍🎉 Test";
  const mockPageData: PageData = {
    base: "https://example.com",
    locale: "en",
    user: null,
    publicUser: { id: null, name: "Anonymous", imageUrl: null },
    settings: null,
    customText: unicodeText,
  };

  const { result } = renderHook(() => useUrlCustomText(), {
    wrapper: createWrapper(mockPageData),
  });

  await waitFor(() => {
    equal(result.current, unicodeText);
  });
});

test("handles mix of special characters including quotes", async () => {
  const textWithQuotes =
    "Text with \"double quotes\" and 'single quotes' and `backticks`";
  const mockPageData: PageData = {
    base: "https://example.com",
    locale: "en",
    user: null,
    publicUser: { id: null, name: "Anonymous", imageUrl: null },
    settings: null,
    customText: textWithQuotes,
  };

  const { result } = renderHook(() => useUrlCustomText(), {
    wrapper: createWrapper(mockPageData),
  });

  await waitFor(() => {
    equal(result.current, textWithQuotes);
  });
});

test("handles HTML-like characters safely", async () => {
  const htmlLikeText =
    "\u003Cdiv\u003ETest\u003C/div\u003E &amp; &lt;tag&gt; &quot;quotes&quot;";
  const mockPageData: PageData = {
    base: "https://example.com",
    locale: "en",
    user: null,
    publicUser: { id: null, name: "Anonymous", imageUrl: null },
    settings: null,
    customText: htmlLikeText,
  };

  const { result } = renderHook(() => useUrlCustomText(), {
    wrapper: createWrapper(mockPageData),
  });

  await waitFor(() => {
    equal(result.current, htmlLikeText);
  });
});

test("handles text with newlines and tabs", async () => {
  const textWithWhitespace = "Line 1\nLine 2\tTabbed\r\nLine 4";
  const mockPageData: PageData = {
    base: "https://example.com",
    locale: "en",
    user: null,
    publicUser: { id: null, name: "Anonymous", imageUrl: null },
    settings: null,
    customText: textWithWhitespace,
  };

  const { result } = renderHook(() => useUrlCustomText(), {
    wrapper: createWrapper(mockPageData),
  });

  await waitFor(() => {
    // Text should be preserved as-is (except leading/trailing trim)
    equal(result.current, textWithWhitespace);
  });
});

test("handles text near browser URL limit (~2000 chars)", async () => {
  // Most browsers limit URLs to ~2000 characters
  // Testing that the code handles near-limit length correctly
  const repeatUnit = "!@#$%^&*()[]{}<>?/\\\\|~`\"':;-+=abc";
  const longSpecialText = repeatUnit.repeat(25); // ~925 chars, well within URL limits
  const mockPageData: PageData = {
    base: "https://example.com",
    locale: "en",
    user: null,
    publicUser: { id: null, name: "Anonymous", imageUrl: null },
    settings: null,
    customText: longSpecialText,
  };

  const { result } = renderHook(() => useUrlCustomText(), {
    wrapper: createWrapper(mockPageData),
  });

  await waitFor(() => {
    if (result.current) {
      equal(result.current, longSpecialText);
    } else {
      throw new Error("Result should not be null");
    }
  });
});

test("handles zero-width characters and invisible unicode", async () => {
  const invisibleText = "Test\u200B\u200C\u200D\uFEFFText"; // zero-width chars
  const mockPageData: PageData = {
    base: "https://example.com",
    locale: "en",
    user: null,
    publicUser: { id: null, name: "Anonymous", imageUrl: null },
    settings: null,
    customText: invisibleText,
  };

  const { result } = renderHook(() => useUrlCustomText(), {
    wrapper: createWrapper(mockPageData),
  });

  await waitFor(() => {
    equal(result.current, invisibleText);
  });
});

test("handles URL-encoded newlines and special chars", async () => {
  const urlEncodedText = "Line1%0ALine2%0D%0ALine3%09Tabbed";
  const decodedText = "Line1\nLine2\r\nLine3\tTabbed";
  const mockPageData: PageData = {
    base: "https://example.com",
    locale: "en",
    user: null,
    publicUser: { id: null, name: "Anonymous", imageUrl: null },
    settings: null,
    customText: decodedText,
  };

  const { result } = renderHook(() => useUrlCustomText(), {
    wrapper: createWrapper(mockPageData),
  });

  await waitFor(() => {
    equal(result.current, decodedText);
  });
});

test("preserves uppercase letters by disabling lowercase setting", async () => {
  const textWithUppercase = "Hello World with CAPITAL Letters";
  const mockPageData: PageData = {
    base: "https://example.com",
    locale: "en",
    user: null,
    publicUser: { id: null, name: "Anonymous", imageUrl: null },
    settings: new Settings()
      .set(lessonProps.customText.lowercase, true)
      .toJSON(),
    customText: textWithUppercase,
  };

  const { result } = renderHook(() => useUrlCustomText(), {
    wrapper: createWrapper(mockPageData),
  });

  await waitFor(() => {
    equal(result.current, textWithUppercase);
  });
});

test("keeps lowercase setting enabled for lowercase-only text", async () => {
  const lowercaseText = "hello world with only lowercase letters";
  const mockPageData: PageData = {
    base: "https://example.com",
    locale: "en",
    user: null,
    publicUser: { id: null, name: "Anonymous", imageUrl: null },
    settings: new Settings()
      .set(lessonProps.customText.lowercase, true)
      .toJSON(),
    customText: lowercaseText,
  };

  const { result } = renderHook(() => useUrlCustomText(), {
    wrapper: createWrapper(mockPageData),
  });

  await waitFor(() => {
    equal(result.current, lowercaseText);
  });
});
