import { type NamedUser, Screen, usePageData } from "@keybr/pages-shared";
import { type KeyStatsMap } from "@keybr/result";
import { ExplainerBoundary } from "@keybr/widget";
import { AccuracyStreaksSection } from "./profile/AccuracyStreaksSection.tsx";
import { CalendarSection } from "./profile/CalendarSection.tsx";
import { ExplainProfile } from "./profile/ExplainProfile.tsx";
import { FooterSection } from "./profile/FooterSection.tsx";
import { HistogramsSection } from "./profile/HistogramsSection.tsx";
import { KeyFrequencyHeatmapSection } from "./profile/KeyFrequencyHeatmapSection.tsx";
import { KeyFrequencyHistogramSection } from "./profile/KeyFrequencyHistogramSection.tsx";
import { KeySpeedChartSection } from "./profile/KeySpeedChartSection.tsx";
import { KeySpeedHistogramSection } from "./profile/KeySpeedHistogramSection.tsx";
import { ProgressOverviewSection } from "./profile/ProgressOverviewSection.tsx";
import { ResultGrouper } from "./profile/ResultGrouper.tsx";
import { ResultSummary } from "./profile/resultsummary.ts";
import { ShareProfileLink } from "./profile/ShareProfileLink.tsx";
import { SpeedChartSection } from "./profile/SpeedChartSection.tsx";
import { AllTimeSummary, TodaySummary } from "./profile/Summary.tsx";

export function ProfilePage() {
  return (
    <Screen>
      <ExplainerBoundary>
        <ExplainProfile />
        <ResultGrouper>
          {(keyStatsMap) => <Content keyStatsMap={keyStatsMap} />}
        </ResultGrouper>
      </ExplainerBoundary>
    </Screen>
  );
}

function Content({ keyStatsMap }: { readonly keyStatsMap: KeyStatsMap }) {
  const { publicUser } = usePageData();
  const { results } = keyStatsMap;
  const summary = new ResultSummary(results);

  return (
    <>
      <AllTimeSummary summary={summary} />

      <TodaySummary summary={summary} />

      <AccuracyStreaksSection summary={summary} />

      <HistogramsSection summary={summary} />

      <ProgressOverviewSection keyStatsMap={keyStatsMap} />

      <SpeedChartSection results={results} />

      <KeySpeedChartSection keyStatsMap={keyStatsMap} />

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
