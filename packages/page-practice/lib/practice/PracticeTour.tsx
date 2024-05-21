import { KeyLegendList, names } from "@keybr/lesson-ui";
import { Slide, Tour } from "@keybr/widget";
import { memo } from "react";
import { FormattedMessage } from "react-intl";
import { KeyDetailsChartDemo } from "./KeyDetailsChartDemo.tsx";

export const PracticeTour = memo(function PracticeTour({
  onClose,
}: {
  readonly onClose?: () => void;
}) {
  return (
    <Tour onClose={onClose}>
      <Slide size="large">
        <FormattedMessage
          id="practice.tour.slide1"
          defaultMessage={
            "<h1>Learn to Type Faster</h1>" +
            "<p>This web application will help you to learn <em>touch typing</em> which means typing through muscle memory without using your eyesight to find the keys. It can improve your typing speed and accuracy dramatically. The opposite is <em>hunt and peck typing</em>, a method of typing in which you look at the keyboard instead of the screen, and use only the index fingers.</p>" +
            "<p>This is a short tutorial that will explain how this application works.</p>" +
            "<p>You can use the left and right arrow keys to navigate through these slides.</p>"
          }
        />
      </Slide>
      <Slide size="large">
        <FormattedMessage
          id="practice.tour.slide2"
          defaultMessage={
            "<p>Our teaching method is based on these principles:</p>" +
            "<p>No boring repetitive exercises. Unlike most other typing tutors, this application does not force you to repeat the same lessons like ‘<em>jjf jjk jjf jjk</em>’ over and over again. This is very annoying and contributes very little to your overall learning.</p>" +
            "<p>This application uses a sophisticated computer algorithm to generate typing lessons that match your skill level. These lessons consist of random words generated using a subset of the full alphabet of letters. The size of the subset and individual letter frequency is controlled by the algorithm, which provides you with the best learning experience.</p>"
          }
        />
      </Slide>
      <Slide size="large">
        <FormattedMessage
          id="practice.tour.slide3"
          defaultMessage={
            "<p>Initially it starts generating words from a small subset of the most frequent letters in the alphabet.</p>" +
            "<p>When you are typing these words, the application measures the time-to-type metric for every letter in that subset. This time is used to measure your learning progress. The more familiar you become with a letter, the less time it takes for you to type it.</p>" +
            "<p>Once you familiarize yourself with the entire current subset of letters, the algorithm expands it by adding more and more letters to the subset.</p>"
          }
        />
      </Slide>
      <Slide size="large">
        <FormattedMessage
          id="practice.tour.slide4"
          defaultMessage={
            "<p>When the algorithm includes a new letter to the current subset, the frequency of this letter is artificially increased so that it will be included in every generated word of a lesson.</p>" +
            "<p>The algorithm can also artificially rearrange letter frequencies, placing an emphasis on the letters with the worst time-to-type metric.</p>" +
            "<p>This means you will always be typing the letters that you are least familiar with.</p>"
          }
        />
      </Slide>
      <Slide size="small" anchor={`#${names.textInput}`} position="block-end">
        <FormattedMessage
          id="practice.tour.slide5"
          defaultMessage="<p>This is the text board. It displays the text to type out. The text changes for each new lesson. The text is generated automatically from the current subset of letters. Most of the words are not real, but are generated using the phonetic rules of your language so they sound natural and should be easy to pronounce. Besides being funny, this gives us the flexibility to use more words than actually exist.</p>"
        />
      </Slide>
      <Slide size="small" anchor={`#${names.keyboard}`} position="block-start">
        <FormattedMessage
          id="practice.tour.slide6"
          defaultMessage="<p>This is the virtual keyboard. It helps you memorize key positions. Use it to find the keys and try not to look at your physical keyboard. There are small bumps on the <em>F</em> and <em>J</em> keys of your keyboard. Use these to correctly position your index fingers without having to look at the keys. Once your index fingers are in the right position you will be able to locate the remainder of the keys.</p>"
        />
      </Slide>
      <Slide size="small" anchor={`#${names.speed}`} position="block-end">
        <FormattedMessage
          id="practice.tour.slide7"
          defaultMessage={
            "<p>This is the typing speed indicator and the difference from the average value. Your goal is to increase this metric, meaning higher values are better.</p>" +
            "<p>Typing speed is measured in either <em>Words per Minute (WPM)</em> or <em>Characters per Minute (CPM)</em>. The definition of a word is standardized to be five characters, so <em>10WPM</em> is equal to <em>50CPM</em>.</p>" +
            "<p>You can switch between the <em>WPM</em> and the <em>CPM</em> display modes on the Settings page.</p>"
          }
        />
      </Slide>
      <Slide size="small" anchor={`#${names.accuracy}`} position="block-end">
        <FormattedMessage
          id="practice.tour.slide8"
          defaultMessage={
            "<p>This is the accuracy indicator and the difference from the average value. Your goal is to increase this metric, meaning higher values are better.</p>" +
            "<p>Accuracy is computed as the percentage of characters typed without errors. Many typos in the same position count as one error.</p>"
          }
        />
      </Slide>
      <Slide size="small" anchor={`#${names.score}`} position="block-end">
        <FormattedMessage
          id="practice.tour.slide9"
          defaultMessage={
            "<p>This is the typing score indicator in abstract points and the difference from the average value.</p>" +
            "<p>The score is calculated from your typing speed, error count, and the current size of the letter set. The formula is designed to reward for typing speed, and punish for error count. You cannot obtain a high score by typing fast while also making many errors.</p>" +
            "<p>Users who score the highest points are recorded in the high score table.</p>"
          }
        />
      </Slide>
      <Slide size="small" anchor={`#${names.keySet}`} position="block-end">
        <FormattedMessage
          id="practice.tour.slide10"
          defaultMessage="<p>This indicator shows the current subset of letters used to generate the lessons, and your confidence level for every letter in the subset:</p>"
        />
        <KeyLegendList />
      </Slide>
      <Slide size="small" anchor={`#${names.keySet}`} position="block-end">
        <FormattedMessage
          id="practice.tour.slide11"
          defaultMessage="<p>This indicator can also be used to predict the remaining number of lessons that are needed to fully unlock a letter, like in the example chart below. Visit it regularly to get more insight on how your learning is going, to see if you are making a progress.</p>"
        />
        <KeyDetailsChartDemo />
      </Slide>
      <Slide size="small" anchor={`#${names.currentKey}`} position="block-end">
        <FormattedMessage
          id="practice.tour.slide12"
          defaultMessage={
            "<p>This indicator shows details about the letter with increased frequency, which is currently included in every generated word:</p>" +
            "<dl>" +
            "<dt>Best typing speed</dt>" +
            "<dd>Your best typing speed for this individual letter.</dd>" +
            "<dt>Confidence level</dt>" +
            "<dd>A number in range from zero to one which is computed using your typing speed, and indicates your familiarity with this letter. A letter is considered fully learned when it’s confidence level reaches one.</dd>" +
            "<dt>Learning rate</dt>" +
            "<dd>How your typing speed is changing with each lesson.</dd>" +
            "</dl>"
          }
        />
      </Slide>
    </Tour>
  );
});
