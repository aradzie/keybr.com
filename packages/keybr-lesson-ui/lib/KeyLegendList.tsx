import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";
import { KeyLegend } from "./KeyLegend.tsx";

export const KeyLegendList = (): ReactNode => {
  return (
    <ul>
      <li>
        <KeyLegend //
          isIncluded={true}
          confidence={null}
          isFocused={false}
          isForced={false}
        />{" "}
        <FormattedMessage
          id="lesson.indicator.notCalibrated"
          defaultMessage="A non-calibrated key with an unknown confidence level. You still have not pressed this key yet."
        />
      </li>
      <li>
        <KeyLegend //
          isIncluded={true}
          confidence={0}
          isFocused={false}
          isForced={false}
        />{" "}
        <FormattedMessage
          id="lesson.indicator.leastConfidence"
          defaultMessage="A calibrated key with the lowest confidence level. The more times you press this key, the more accurate this metric becomes."
        />
      </li>
      <li>
        <KeyLegend //
          isIncluded={true}
          confidence={1}
          isFocused={false}
          isForced={false}
        />{" "}
        <FormattedMessage
          id="lesson.indicator.mostConfidence"
          defaultMessage="A calibrated key with the highest confidence level. The more times you press this key, the more accurate this metric becomes."
        />
      </li>
      <li>
        <KeyLegend //
          isIncluded={true}
          confidence={0.3}
          isFocused={true}
          isForced={false}
        />{" "}
        <FormattedMessage
          id="lesson.indicator.focused"
          defaultMessage="A key with increased frequency. It takes you the most time to find this key so the algorithm chose it to be included in every generated word."
        />
      </li>
      <li>
        <KeyLegend //
          isIncluded={true}
          confidence={null}
          isFocused={false}
          isForced={true}
        />{" "}
        <FormattedMessage
          id="lesson.indicator.forced"
          defaultMessage="A key which was manually included in the lessons."
        />
      </li>
      <li>
        <KeyLegend //
          isIncluded={false}
          confidence={null}
          isFocused={false}
          isForced={false}
        />{" "}
        <FormattedMessage
          id="lesson.indicator.notIncluded"
          defaultMessage="A key which was not yet included in the lessons."
        />
      </li>
    </ul>
  );
};
