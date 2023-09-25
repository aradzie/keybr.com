import { FakeIntlProvider } from "@keybr/intl";
import test from "ava";
import { createIntl } from "react-intl";
import TestRenderer from "react-test-renderer";
import { AlertIcon } from "./icons.tsx";
import { PageLink, PageLinkTemplate } from "./pagelink.tsx";

test("format trivial", (t) => {
  const intl = createIntl({ locale: "en" });

  const template = new PageLinkTemplate<null>({
    path: "/path",
    name: {
      id: "name",
      description: "test",
      defaultMessage: "name",
    },
    title: {
      id: "title",
      description: "test",
      defaultMessage: "title",
    },
    icon: AlertIcon,
  });

  t.deepEqual(template.bind(null).format(intl), {
    path: "/path",
    name: "name",
    title: "title",
    icon: AlertIcon,
  });
});

test("format simple", (t) => {
  const intl = createIntl({ locale: "en" });

  const template = new PageLinkTemplate<{ id: string }>({
    path: "/prefix/:id",
    name: {
      id: "name",
      description: "test",
      defaultMessage: "name [{id}]",
    },
    title: {
      id: "title",
      description: "test",
      defaultMessage: "title [{id}]",
    },
    icon: AlertIcon,
  });

  t.deepEqual(template.bind({ id: "someId" }).format(intl), {
    path: "/prefix/someId",
    name: "name [someId]",
    title: "title [someId]",
    icon: AlertIcon,
  });
});

test("format complex", (t) => {
  const intl = createIntl({ locale: "en" });

  const template = new PageLinkTemplate<{ a: string; b: string }>({
    path: "/prefix/:a/and/:b",
    name: {
      id: "name",
      description: "test",
      defaultMessage: "name {a} and {b}",
    },
    title: {
      id: "title",
      description: "test",
      defaultMessage: "title {a} and {b}",
    },
    icon: AlertIcon,
  });

  t.deepEqual(template.bind({ a: "x", b: "y" }).format(intl), {
    path: "/prefix/x/and/y",
    name: "name x and y",
    title: "title x and y",
    icon: AlertIcon,
  });
});

test("render with default template", (t) => {
  const template = new PageLinkTemplate<null>({
    path: "/path",
    name: {
      id: "name",
      description: "test",
      defaultMessage: "name",
    },
    title: {
      id: "title",
      description: "test",
      defaultMessage: "title",
    },
    icon: AlertIcon,
  });

  const testRenderer = TestRenderer.create(
    <FakeIntlProvider>
      <PageLink link={template.bind(null)} className="link-class" />
    </FakeIntlProvider>,
  );

  t.snapshot(testRenderer.toJSON());
});

test("render with custom template", (t) => {
  const template = new PageLinkTemplate<null>({
    path: "/path",
    name: {
      id: "name",
      description: "test",
      defaultMessage: "name",
    },
    title: {
      id: "title",
      description: "test",
      defaultMessage: "title",
    },
    icon: AlertIcon,
  });

  const testRenderer = TestRenderer.create(
    <FakeIntlProvider>
      <PageLink link={template.bind(null)} className="link-class">
        {({ path, name }) => (
          <span className="span-class">
            {path} {name}
          </span>
        )}
      </PageLink>
    </FakeIntlProvider>,
  );

  t.snapshot(testRenderer.toJSON());
});
