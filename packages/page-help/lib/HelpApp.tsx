import { Layout, loadKeyboard } from "@keybr/keyboard";
import { KeyLayer, VirtualKeyboard, ZonesLayer } from "@keybr/keyboard-ui";
import { KeyLegendList } from "@keybr/lesson-ui";
import { singleLine } from "@keybr/textinput";
import { StaticText } from "@keybr/textinput-ui";
import { Article, Figure } from "@keybr/widget";
import { type ReactNode } from "react";
import { FormattedMessage } from "react-intl";
import { alphabet } from "./english.ts";
import { ExampleLink } from "./ExampleLink.tsx";
import { KeySetIllustration } from "./figures.tsx";
import * as styles from "./HelpApp.module.less";

export function HelpApp(): ReactNode {
  const keyboard = loadKeyboard(Layout.EN_US);

  return (
    <Article>
      <FormattedMessage
        id="help.section1"
        defaultMessage={
          "<h1>Learn to type faster</h1>" +
          "<h2>Touch typing</h2>" +
          "<p>This web application will help you to learn <em>touch typing</em>, which means typing through muscle memory without using your eyesight to find the keys on the keyboard. It can improve your typing speed and accuracy dramatically. The opposite is <em>hunt-and-peck typing</em>, a method of typing in which you look at the keyboard instead of the screen, and use only the index fingers.</p>"
        }
      />

      <FormattedMessage
        id="help.section2"
        defaultMessage={
          "<h2>The teaching method</h2>" +
          "<p>This application uses a unique approach. It employs statistics and smart algorithms to automatically create typing lessons that match your current skill level. It works by repeating the following cycle:</p>" +
          "<ol>" +
          "<li>The algorithm generates a list of random words for you, based on your typing skills. Your skill level is measured using the typing statistics collected so far. The words consist of a set of letters selected by the algorithm.</li>" +
          "<li>You type the given words. You try to make as few mistakes as possible.</li>" +
          "<li>As you type, the algorithm collects your typing statistics, such as the time-to-type metric for each individual key. At the end, these statistics are used to generate the next list of words for step one.</li>" +
          "</ol>" +
          "<p>At each stage you just type the provided lists of words, and the computer does the rest.</p>"
        }
      />

      <FormattedMessage
        id="help.section3"
        defaultMessage={
          "<h2>The word generating algorithm</h2>" +
          "<p>This application generates random but readable and pronounceable words, using the phonetic rules of your native language. These words look almost natural, and often are. Typing sensible text is much easier than repeating random letters, and it helps you remember frequent key combinations. The latest point is crucial. For example, it’s almost impossible for the letter ‘<em>W</em>’ to follow the ‘<em>Z</em>’ in English, and you will never type such a combination in this application. Instead, you will type more common words, such as ‘<em>the</em>’, ‘<em>that</em>’, ‘<em>with</em>’, and so on. Soon you will learn how to type the ‘<em>th</em>’ combo really fast.</p>" +
          "<p>The words are generated from the letters which are selected using the following rules.</p>"
        }
      />

      <section className={styles.rule}>
        <h3 className={styles.ruleNumber}>1</h3>
        <h3>
          <FormattedMessage
            id="help.rule1.title"
            defaultMessage="The algorithm starts with the initial letters"
          />
        </h3>

        <div className={styles.example}>
          <KeySetIllustration
            confidences={[null, null, null, null, null, null]}
          />
        </div>

        <div className={styles.example}>
          <StaticText
            lines={singleLine(
              "teen nien neer nient relier ine neerine elerine neer",
            )}
          />
        </div>

        <FormattedMessage
          id="help.rule1.body"
          defaultMessage="<p>When you start practicing for the first time the computer knows nothing about your typing skills, so it uses a small set of the most common letters to generate words such as ‘<em>E</em>’, ‘<em>N</em>’, ‘<em>I</em>’, ‘<em>T</em>’, ‘<em>R</em>’ and ‘<em>L</em>’. All generated words will consist of this small letter set, with the remaining letters being unused. As the statistics for the letters are unknown, the corresponding indicators are gray.</p>"
        />
      </section>

      <section className={styles.rule}>
        <h3 className={styles.ruleNumber}>2</h3>
        <h3>
          <FormattedMessage
            id="help.rule2.title"
            defaultMessage="You learn the initial letters"
          />
        </h3>

        <div className={styles.example}>
          <KeySetIllustration confidences={[0.9, 0.6, 0.7, 0.4, 0.5, 0.5]} />
        </div>

        <div className={styles.example}>
          <StaticText
            lines={singleLine(
              "entin entle intell letter rittle ritin tete titient",
            )}
          />
        </div>

        <FormattedMessage
          id="help.rule2.body"
          defaultMessage="<p>As you begin to type the generated words, the computer collects your typing statistics. The indicators start to change their colors from red to green. The color red means the typing speed for that individual key is slow, and the color green indicates the opposite. At this stage your goal is to make all the letters green by improving your typing speed. Please note that in this example, letter ‘<em>T</em>’ is highlighted as it has the worst typing speed metric, so it becomes the target letter. The target letter is included in every generated word and this is a crucial piece of information to know. It means that at any given time you are practicing the exact key that gives you the most trouble.</p>"
        />
      </section>

      <section className={styles.rule}>
        <h3 className={styles.ruleNumber}>3</h3>
        <h3>
          <FormattedMessage
            id="help.rule3.title"
            defaultMessage="The algorithm adds more letters"
          />
        </h3>

        <div className={styles.example}>
          <KeySetIllustration confidences={[1, 1, 1, 1, 1, 1, null]} />
        </div>

        <div className={styles.example}>
          <StaticText
            lines={singleLine(
              "less les list res rise ins test tes listree listree",
            )}
          />
        </div>

        <FormattedMessage
          id="help.rule3.body"
          defaultMessage="<p>When your typing speed improves, and all the letters finally become green, a new letter ‘<em>S</em>’ is added to the set. The random words will be generated from this new expanded set of letters. Letter ‘<em>S</em>’ is the target letter and appears in every generated word. Again, the indicator color of this letter is gray because its typing statistics are unknown.</p>"
        />
      </section>

      <section className={styles.rule}>
        <h3 className={styles.ruleNumber}>4</h3>
        <h3>
          <FormattedMessage
            id="help.rule4.title"
            defaultMessage="You learn additional letters"
          />
        </h3>

        <div className={styles.example}>
          <KeySetIllustration confidences={[1, 0.8, 0.9, 0.7, 0.6, 0.7, 0.3]} />
        </div>

        <div className={styles.example}>
          <StaticText
            lines={singleLine(
              "res ress risin its seen rise ensiste liste its estine",
            )}
          />
        </div>

        <FormattedMessage
          id="help.rule4.body"
          defaultMessage="<p>At this step your goal is to make this new letter green, and when this happens, yet another letter is added to the set, and the cycle continues. Realistically speaking, it is very likely that the typing speed of the previous letters will degrade, and you will see that they become red again, as in the example. This is expected, your goal is still the same, to make the new target letter green to unlock the next one.</p>"
        />
      </section>

      <section className={styles.rule}>
        <h3 className={styles.ruleNumber}>5</h3>
        <h3>
          <FormattedMessage
            id="help.rule5.title"
            defaultMessage="The cycle repeats"
          />
        </h3>

        <div className={styles.example}>
          <KeySetIllustration
            confidences={Object.keys(alphabet).map((_) => 1)}
          />
        </div>

        <div className={styles.example}>
          <StaticText
            lines={singleLine("a list of words with all the letters")}
          />
        </div>

        <FormattedMessage
          id="help.rule5.body"
          defaultMessage="<p>If you are persistent enough, sooner or later all the letters will become green. Congratulations, you have achieved your main goal! However, this does not mean that you should stop learning, you can keep going for as long as you wish.</p>"
        />
      </section>

      <FormattedMessage
        id="help.section4"
        defaultMessage="<p>The precise meaning of each indicator color is given in the following legend.</p>"
      />

      <Figure>
        <Figure.Caption>
          <FormattedMessage
            id="help.indicators.caption"
            defaultMessage="Indicator color coding."
          />
        </Figure.Caption>
        <KeyLegendList />
      </Figure>

      <FormattedMessage
        id="help.section5"
        defaultMessage={
          "<h2>The right way to use keyboard</h2>" +
          "<p>Put all your fingers on the home row, the one containing the <em>Caps Lock</em> key. There are small bumps on the keys ‘<em>F</em>’ and ‘<em>J</em>’, put your index fingers on the bumps. Each finger is responsible for its own set of keys, as explained in the next illustration.</p>"
        }
      />

      <Figure>
        <Figure.Caption>
          <FormattedMessage
            id="help.keyboardZones.caption"
            defaultMessage="Keyboard zones and the proper finger placement."
          />
        </Figure.Caption>
        <VirtualKeyboard keyboard={keyboard}>
          <KeyLayer showColors={true} />
          <ZonesLayer />
        </VirtualKeyboard>
      </Figure>

      <FormattedMessage
        id="help.section6"
        defaultMessage={
          "<h2>The effectiveness of this application</h2>" +
          "<p>We selected a few example profiles to show you how people progress in learning touch typing when using this application. These are real, anonymized user profiles. Hopefully they will inspire you to keep learning!</p>"
        }
      />

      <ul>
        <li>
          <FormattedMessage
            id="help.example1"
            defaultMessage="<a>Example 1</a>, from 30 to 70 WPM after 4 hours 20 minutes of practicing in the course of 15 days."
            values={{
              a: (chunks) => <ExampleLink index={1}>{chunks}</ExampleLink>,
            }}
          />
        </li>

        <li>
          <FormattedMessage
            id="help.example2"
            defaultMessage="<a>Example 2</a>, from 35 to 70 WPM after 2 hours and 20 minutes of practicing in the course of 12 days."
            values={{
              a: (chunks) => <ExampleLink index={2}>{chunks}</ExampleLink>,
            }}
          />
        </li>

        <li>
          <FormattedMessage
            id="help.example3"
            defaultMessage="<a>Example 3</a>, a decent jump from less than 20 to 40 WPM after 5 hours and 30 minutes of practicing in the course of 11 days."
            values={{
              a: (chunks) => <ExampleLink index={3}>{chunks}</ExampleLink>,
            }}
          />
        </li>

        <li>
          <FormattedMessage
            id="help.example4"
            defaultMessage="<a>Example 4</a>, after 2 hours and 10 minutes of practicing in the course of 11 days, typing speed stayed at ~70 WPM (which is already pretty high), but accuracy improved."
            values={{
              a: (chunks) => <ExampleLink index={4}>{chunks}</ExampleLink>,
            }}
          />
        </li>

        <li>
          <FormattedMessage
            id="help.example5"
            defaultMessage="<a>Example 5</a>, from 20 to 45 WPM after about 10 hours of practicing in the course of 22 day (yes, sometimes it takes longer)."
            values={{
              a: (chunks) => <ExampleLink index={5}>{chunks}</ExampleLink>,
            }}
          />
        </li>
      </ul>
    </Article>
  );
}
