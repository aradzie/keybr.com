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
