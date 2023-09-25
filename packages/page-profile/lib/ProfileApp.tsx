import { type NamedUser, usePageData } from "@keybr/pages-shared";
import { type KeyStatsMap } from "@keybr/result";
import { type ReactNode } from "react";
import { CalendarSection } from "./profile/CalendarSection.tsx";
import { ComparisonSection } from "./profile/ComparisonSection.tsx";
import { FooterSection } from "./profile/FooterSection.tsx";
import { HistogramSection } from "./profile/HistogramSection.tsx";
import { KeyFrequencyHeatmapSection } from "./profile/KeyFrequencyHeatmapSection.tsx";
import { KeyFrequencyHistogramSection } from "./profile/KeyFrequencyHistogramSection.tsx";
import { KeySpeedHistogramSection } from "./profile/KeySpeedHistogramSection.tsx";
import { KeyTypingSpeedSection } from "./profile/KeyTypingSpeedSection.tsx";
import { ProgressOverviewSection } from "./profile/ProgressOverviewSection.tsx";
import { ResultGrouper } from "./profile/ResultGrouper.tsx";
import { ShareProfileLink } from "./profile/ShareProfileLink.tsx";
import { newSpeedDistribution } from "./profile/speed/dist.ts";
import {
  AllTimeSummary,
  TodaySummary,
  useSummary,
} from "./profile/Summary.tsx";
import { TypingSpeedSection } from "./profile/TypingSpeedSection.tsx";
import * as styles from "./styles.module.less";

export function ProfileApp(): ReactNode {
  return (
    <div className={styles.profile}>
      <ResultGrouper>
        {(keyStatsMap) => {
          return <Content keyStatsMap={keyStatsMap} />;
        }}
      </ResultGrouper>
    </div>
  );
}

function Content({
  keyStatsMap,
}: {
  readonly keyStatsMap: KeyStatsMap;
}): ReactNode {
  const { publicUser } = usePageData();
  const { results } = keyStatsMap;
  const distribution = newSpeedDistribution();
  const summary = useSummary(results, distribution);

  return (
    <>
      <AllTimeSummary summary={summary} />

      <TodaySummary summary={summary} />

      <ComparisonSection summary={summary} />

      <HistogramSection results={results} distribution={distribution} />

      <ProgressOverviewSection keyStatsMap={keyStatsMap} />

      <TypingSpeedSection results={results} />

      <KeyTypingSpeedSection keyStatsMap={keyStatsMap} />

      <KeySpeedHistogramSection keyStatsMap={keyStatsMap} />

      <KeyFrequencyHistogramSection keyStatsMap={keyStatsMap} />

      <KeyFrequencyHeatmapSection keyStatsMap={keyStatsMap} />

      <CalendarSection
        today={summary.today}
        resultsByDate={summary.resultsByDate}
      />

      {publicUser.id != null && (
        <ShareProfileLink user={publicUser as NamedUser} />
      )}

      <FooterSection />
    </>
  );
}
