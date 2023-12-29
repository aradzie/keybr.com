import { loadKeyboard } from "@keybr/keyboard";
import { Layout } from "@keybr/layout";
import { Article, Header, Link, Para } from "@keybr/widget";
import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";
import { KeyFrequencyHeatmap } from "./KeyFrequencyHeatmap.tsx";

export function LayoutsApp(): ReactNode {
  const qwerty = loadKeyboard(Layout.EN_US);
  const dvorak = loadKeyboard(Layout.EN_US_DVORAK);
  const colemak = loadKeyboard(Layout.EN_US_COLEMAK);
  const workman = loadKeyboard(Layout.EN_US_WORKMAN);
  const colemak_dh = loadKeyboard(Layout.EN_US_COLEMAK_DH);

  return (
    <Article>
      <Header level={2}>
        <LayoutName layout={qwerty.layout} />
      </Header>

      <Para>
        <WikipediaLink href="https://en.wikipedia.org/wiki/QWERTY" />
      </Para>

      <FormattedMessage
        id="layouts.layout.qwerty.description"
        defaultMessage={
          "<p>It all started in the 1860s. An amateur inventor, politician, printer and newspaper man in Milwaukee by the name of Christopher Latham Sholes, often spent his spare time tinkering with and creating new machines to make his businesses more efficient.</p>" +
          "<p>The popular theory states that Sholes had to redesign the keyboard in response to the mechanical failings of early typewriters. The type bars connecting the key and the letter plate hung in a cycle beneath the paper. If a user quickly typed a succession of letters whose type bars were near each other, the delicate machinery would get jammed.</p>" +
          "<p>Sholes redesigned the arrangement to separate the most common sequences of letters like “th” or “he”. The machine was produced under licence in 1875 by the New York based arms manufacturer, Remington and Sons. The machine was named the Remington No. 1 and was a commercial failure failing to sell in large numbers.</p>" +
          "<p>After receiving feedback, the Remington company updated the machine to create the Remington No. 2. This new machine was released in 1877 and was hugely successful. It was the first to use the QWERTY keyboard layout as we know it today, giving users the option to type upper and lower case letters, moving between the two by use of a “Shift” key.</p>" +
          "<p>The classic QWERTY keyboard layout is an unfortunate historical accident and is not optimal, and that is why the other layouts were invented.</p>"
        }
      />

      <KeyFrequencyHeatmap keyboard={qwerty} />

      <Header level={2}>
        <LayoutName layout={dvorak.layout} />
      </Header>

      <Para>
        <WikipediaLink href="https://en.wikipedia.org/wiki/Dvorak_Simplified_Keyboard" />
      </Para>

      <FormattedMessage
        id="layouts.layout.dvorak.description"
        defaultMessage={
          "<p>Dvorak is a keyboard layout for the English language created in 1936 by August Dvorak and William Dealey. It was designed to be a faster, more ergonomic alternative to the QWERTY layout. Dvorak proponents claim that it requires less finger motion and as a result reduces errors, increases typing speed, reduces repetitive strain injuries, and offers a more comfortable experience compared to QWERTY.</p>" +
          "<p>However, it failed to replace QWERTY as the most common keyboard layout mainly due to QWERTY being introduced 60 years earlier.</p>" +
          "<p>As of 2005, the fastest English language typist in the world record was set using the Dvorak keyboard layout by Barbara Blackburn.</p>" +
          "<p>Almost all major modern operating systems allow a user to switch to the Dvorak layout, and there is a good chance that your OS supports it too.</p>"
        }
      />

      <KeyFrequencyHeatmap keyboard={dvorak} />

      <Header level={2}>
        <LayoutName layout={colemak.layout} />
      </Header>

      <Para>
        <WebsiteLink href="https://colemak.com/" />,{" "}
        <WikipediaLink href="https://en.wikipedia.org/wiki/Colemak" />
      </Para>

      <FormattedMessage
        id="layouts.layout.colemak.description"
        defaultMessage={
          "<p>The Colemak layout is designed to be a practical alternative to the Qwerty and Dvorak keyboard layouts, offering a more incremental change for users already accustomed to the standard layout.</p>" +
          "<p>The Colemak layout was designed with the QWERTY layout as a base, changing the positions of 17 keys while retaining the QWERTY positions of most non-alphabetic characters and many popular keyboard shortcuts. This makes it easier to learn for people who already type in QWERTY. It shares several design goals with the Dvorak layout, such as minimizing finger path distance and making heavy use of the home row.</p>" +
          "<p>It is supported by many major modern operating systems.</p>"
        }
      />

      <KeyFrequencyHeatmap keyboard={colemak} />

      <Header level={2}>
        <LayoutName layout={workman.layout} />
      </Header>

      <Para>
        <WebsiteLink href="https://workmanlayout.org/" />
      </Para>

      <FormattedMessage
        id="layouts.layout.workman.description"
        defaultMessage={
          "<p>The Workman layout reduced lateral movement of the fingers and wrists, more balanced left and right hand usage. 21 characters are different from Qwerty.</p>" +
          "<p>The Workman layout offers many benefits. It is comfortable, ergonomic, and efficient, with frequent keys being placed within the natural range of motion of the fingers. The need for lateral movement is reduced for the fingers and wrists. There is also very low overall finger travel.</p>" +
          "<p>The Workman layout is found to achieve overall less travel distance of the fingers for the English language than even Colemak. It does however generally incur higher same-finger n-gram frequencies; or in other words, one finger will need to hit two keys in succession more often than in other layouts.</p>"
        }
      />

      <KeyFrequencyHeatmap keyboard={workman} />

      <Header level={2}>
        <LayoutName layout={colemak_dh.layout} />
      </Header>

      <Para>
        <WebsiteLink href="https://colemakmods.github.io/mod-dh/" />
      </Para>

      <FormattedMessage
        id="layouts.layout.colemak.description_dh"
        defaultMessage="<p>The Colemak-DH layout serves as a practical alternative to both QWERTY and Dvorak keyboard layouts, offering a smoother transition for users accustomed to the standard layout. Building upon QWERTY, it relocates 17 keys while retaining the positions of non-alphabetic characters and popular shortcuts, making it user-friendly for those familiar with QWERTY. It shares design goals with Dvorak, emphasizing minimized finger movement and home row utilization. Colemak-DH enjoys widespread support across modern operating systems, ensuring accessibility and ergonomic benefits for users.</p>"
      />

      <KeyFrequencyHeatmap keyboard={colemak_dh} />
    </Article>
  );
}

function LayoutName({ layout }: { readonly layout: Layout }): ReactNode {
  return (
    <FormattedMessage
      id="layouts.layoutName.header"
      defaultMessage="{name} Layout"
      values={{ name: layout.name }}
    />
  );
}

function WebsiteLink({ href }: { readonly href: string }): ReactNode {
  return (
    <Link href={href} target={href} external={true}>
      <FormattedMessage
        id="layouts.link.website.name"
        defaultMessage="Official website"
      />
    </Link>
  );
}

function WikipediaLink({ href }: { readonly href: string }): ReactNode {
  return (
    <Link href={href} target={href} external={true}>
      <FormattedMessage
        id="layouts.link.wikipedia.name"
        defaultMessage="Wikipedia article"
      />
    </Link>
  );
}
