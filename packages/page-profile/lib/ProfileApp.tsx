import { makeSpeedDistribution } from "@keybr/chart";
import { type NamedUser, Screen, usePageData } from "@keybr/pages-shared";
import { type KeyStatsMap, ResultSummary } from "@keybr/result";
import { type ReactNode } from "react";
import { AccuracySection } from "./profile/AccuracySection.tsx";
import { CalendarSection } from "./profile/CalendarSection.tsx";
import { ComparisonSection } from "./profile/ComparisonSection.tsx";
import { DistributionSection } from "./profile/DistributionSection.tsx";
import { FooterSection } from "./profile/FooterSection.tsx";
import { KeyFrequencyHeatmapSection } from "./profile/KeyFrequencyHeatmapSection.tsx";
import { KeyFrequencyHistogramSection } from "./profile/KeyFrequencyHistogramSection.tsx";
import { KeySpeedHistogramSection } from "./profile/KeySpeedHistogramSection.tsx";
import { KeyTypingSpeedSection } from "./profile/KeyTypingSpeedSection.tsx";
import { ProgressOverviewSection } from "./profile/ProgressOverviewSection.tsx";
import { ResultGrouper } from "./profile/ResultGrouper.tsx";
import { ShareProfileLink } from "./profile/ShareProfileLink.tsx";
import { AllTimeSummary, TodaySummary } from "./profile/Summary.tsx";
import { TypingSpeedSection } from "./profile/TypingSpeedSection.tsx";

export function ProfileApp(): ReactNode {
  return (
    <Screen>
      <ResultGrouper>
        {(keyStatsMap) => <Content keyStatsMap={keyStatsMap} />}
      </ResultGrouper>
    </Screen>
  );
}

function Content({
  keyStatsMap,
}: {
  readonly keyStatsMap: KeyStatsMap;
}): ReactNode {
  const { publicUser } = usePageData();
  const { results } = keyStatsMap;
  const summary = new ResultSummary(results);
  const distribution = makeSpeedDistribution();

  return (
    <>
      <AllTimeSummary summary={summary} />

      <TodaySummary summary={summary} />

      <AccuracySection summary={summary} />

      <ComparisonSection summary={summary} distribution={distribution} />

      <DistributionSection summary={summary} distribution={distribution} />

      <ProgressOverviewSection keyStatsMap={keyStatsMap} />

      <TypingSpeedSection results={results} />

      <KeyTypingSpeedSection keyStatsMap={keyStatsMap} />

      <KeySpeedHistogramSection keyStatsMap={keyStatsMap} />

      <KeyFrequencyHistogramSection keyStatsMap={keyStatsMap} />

      <KeyFrequencyHeatmapSection keyStatsMap={keyStatsMap} />

      <CalendarSection summary={summary} />

      {publicUser.id != null && (
        <ShareProfileLink user={publicUser as NamedUser} />
      )}

      <FooterSection />
    </>
  );
}
