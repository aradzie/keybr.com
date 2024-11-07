import { type NamedUser, Screen, UserName } from "@keybr/pages-shared";
import { type KeyStatsMap } from "@keybr/result";
import { ExplainerBoundary, Header } from "@keybr/widget";
import { AccuracyStreaksSection } from "./profile/AccuracyStreaksSection.tsx";
import { CalendarSection } from "./profile/CalendarSection.tsx";
import { ExplainProfile } from "./profile/ExplainProfile.tsx";
import { HistogramsSection } from "./profile/HistogramsSection.tsx";
import { KeyFrequencyHeatmapSection } from "./profile/KeyFrequencyHeatmapSection.tsx";
import { KeyFrequencyHistogramSection } from "./profile/KeyFrequencyHistogramSection.tsx";
import { KeySpeedChartSection } from "./profile/KeySpeedChartSection.tsx";
import { KeySpeedHistogramSection } from "./profile/KeySpeedHistogramSection.tsx";
import { ProgressOverviewSection } from "./profile/ProgressOverviewSection.tsx";
import { ResultGrouper } from "./profile/ResultGrouper.tsx";
import { ResultSummary } from "./profile/resultsummary.ts";
import { SpeedChartSection } from "./profile/SpeedChartSection.tsx";
import { AllTimeSummary } from "./profile/Summary.tsx";

export function PublicProfilePage({ user }: { readonly user: NamedUser }) {
  return (
    <Screen>
      <ExplainerBoundary>
        <ExplainProfile />
        <Header level={1}>
          <UserName user={user} />
        </Header>
        <ResultGrouper>
          {(keyStatsMap) => <Content keyStatsMap={keyStatsMap} />}
        </ResultGrouper>
      </ExplainerBoundary>
    </Screen>
  );
}

function Content({ keyStatsMap }: { readonly keyStatsMap: KeyStatsMap }) {
  const { results } = keyStatsMap;
  const summary = new ResultSummary(results);

  return (
    <>
      <AllTimeSummary summary={summary} />

      <AccuracyStreaksSection summary={summary} />

      <HistogramsSection summary={summary} />

      <ProgressOverviewSection keyStatsMap={keyStatsMap} />

      <SpeedChartSection results={results} />

      <KeySpeedChartSection keyStatsMap={keyStatsMap} />

      <KeySpeedHistogramSection keyStatsMap={keyStatsMap} />

      <KeyFrequencyHistogramSection keyStatsMap={keyStatsMap} />

      <KeyFrequencyHeatmapSection keyStatsMap={keyStatsMap} />

      <CalendarSection summary={summary} />
    </>
  );
}
