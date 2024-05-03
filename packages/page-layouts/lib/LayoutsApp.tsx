import {
  Language,
  Layout,
  loadKeyboard,
  useFormattedNames,
} from "@keybr/keyboard";
import { Alphabet } from "@keybr/phonetic-model";
import { PhoneticModelLoader } from "@keybr/phonetic-model-loader";
import { Article, Field, FieldList, OptionList } from "@keybr/widget";
import { type ReactNode, useState } from "react";
import { FormattedMessage } from "react-intl";
import { KeyFrequencyHeatmap } from "./KeyFrequencyHeatmap.tsx";

export function LayoutsApp(): ReactNode {
  const { formatLanguageName } = useFormattedNames();
  const [language, setLanguage] = useState(Language.EN);
  const keyboards = Layout.ALL.filter(
    (layout) => layout.language === language,
  ).map((layout) => loadKeyboard(layout));
  return (
    <Article>
      <FormattedMessage
        id="page.layouts.content"
        defaultMessage={
          "<h1>Keyboard Layouts</h1>" +
          "<p>These charts visualize the efficiency of different keyboard layouts. An efficiency is a measure of how easy it is to type on a keyboard.</p>" +
          "<p>The circles show relative key frequencies, and the arcs show relative key pair frequencies.</p>" +
          "<p>It is easier to type when the most frequent keys are on the home row, and when the most frequent key pairs are typed with different fingers and hands. Therefore an efficient layout has the largest circles on the home row. It also has arcs that are evenly distributed across the keyboard, long and horizontal, rather than short and diagonal, because it indicates the frequent switching of fingers and hands.</p>"
        }
      />
      <dl>
        <dt>
          <FormattedMessage
            id="layouts.stats.homeRowKeys.name"
            defaultMessage="Keys on the home row:"
          />
        </dt>
        <dd>
          <FormattedMessage
            id="layouts.stats.homeRowKeys.description"
            defaultMessage="The percentage of keys typed without leaving the Caps Lock row, the more the better."
          />
        </dd>
        <dt>
          <FormattedMessage
            id="layouts.stats.topRowKeys.name"
            defaultMessage="Keys on the top row:"
          />
        </dt>
        <dd>
          <FormattedMessage
            id="layouts.stats.topRowKeys.description"
            defaultMessage="The percentage of keys typed on the Tab row, the less the better."
          />
        </dd>
        <dt>
          <FormattedMessage
            id="layouts.stats.bottomRowKeys.name"
            defaultMessage="Keys on the bottom row:"
          />
        </dt>
        <dd>
          <FormattedMessage
            id="layouts.stats.bottomRowKeys.description"
            defaultMessage="The percentage of keys typed on the Shift row, the less the better."
          />
        </dd>
        <dt>
          <FormattedMessage
            id="layouts.stats.sameHandKeys.name"
            defaultMessage="Keys typed by the same hand:"
          />
        </dt>
        <dd>
          <FormattedMessage
            id="layouts.stats.sameHandKeys.description"
            defaultMessage="The percentage of keys typed by the same hand, the less the better."
          />
        </dd>
        <dt>
          <FormattedMessage
            id="layouts.stats.sameFingerKeys.name"
            defaultMessage="Keys typed by the same finger:"
          />
        </dt>
        <dd>
          <FormattedMessage
            id="layouts.stats.sameFingerKeys.description"
            defaultMessage="The percentage of keys typed by the same finger, the less the better."
          />
        </dd>
      </dl>
      <FieldList>
        <Field>
          <FormattedMessage
            id="page.layouts.language"
            defaultMessage="Language:"
          />
        </Field>
        <Field>
          <OptionList
            options={Language.ALL.map((item) => ({
              name: formatLanguageName(item),
              value: item.id,
            }))}
            value={language.id}
            onSelect={(id) => {
              setLanguage(Language.ALL.get(id));
            }}
          />
        </Field>
      </FieldList>
      <PhoneticModelLoader language={language}>
        {(model) => {
          return (
            <>
              <FieldList>
                <Field>
                  <FormattedMessage
                    id="page.layouts.alphabet"
                    defaultMessage="Alphabet:"
                  />
                </Field>
                <Field>
                  <Alphabet model={model} />
                </Field>
              </FieldList>
              {keyboards.map((keyboard) => (
                <KeyFrequencyHeatmap
                  key={keyboard.layout.id}
                  keyboard={keyboard}
                  model={model}
                />
              ))}
            </>
          );
        }}
      </PhoneticModelLoader>
    </Article>
  );
}
