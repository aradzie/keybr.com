import { FakeIntlProvider } from "@keybr/intl";
import { render } from "@testing-library/react";
import test from "ava";
import { createIntl } from "react-intl";
import { AlertIcon } from "./icons.tsx";
import { PageLink, PageLinkTemplate } from "./pagelink.tsx";

test("format trivial", (t) => {
  const intl = createIntl({ locale: "en" });

  const template = new PageLinkTemplate<null>({
    path: "/path",
    name: {
      id: "name",
      defaultMessage: "name",
    },
    title: {
      id: "title",
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
      defaultMessage: "name [{id}]",
    },
    title: {
      id: "title",
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
      defaultMessage: "name {a} and {b}",
    },
    title: {
      id: "title",
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

test.serial("render with default template", (t) => {
  const template = new PageLinkTemplate<null>({
    path: "/path",
    name: {
      id: "name",
      defaultMessage: "name",
    },
    title: {
      id: "title",
      defaultMessage: "title",
    },
    icon: AlertIcon,
  });

  const r = render(
    <FakeIntlProvider>
      <PageLink link={template.bind(null)} className="link-class" />
    </FakeIntlProvider>,
  );

  t.is(r.container.textContent, "name");

  r.unmount();
});

test.serial("render with custom template", (t) => {
  const template = new PageLinkTemplate<null>({
    path: "/path",
    name: {
      id: "name",
      defaultMessage: "name",
    },
    title: {
      id: "title",
      defaultMessage: "title",
    },
    icon: AlertIcon,
  });

  const r = render(
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

  t.is(r.container.textContent, "/path name");

  r.unmount();
});
