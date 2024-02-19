import { useIntlNumbers } from "@keybr/intl";
import { type Player, positionName } from "@keybr/multiplayer-shared";
import { UserName } from "@keybr/pages-shared";
import { NameValue, Value } from "@keybr/widget";
import { clsx } from "clsx";
import { memo, type ReactNode } from "react";
import { useIntl } from "react-intl";
import { CarImage } from "./image/car.tsx";
import * as styles from "./Lane.module.less";

export const Lane = memo(function Lane({
  player,
  me,
}: {
  readonly player: Player;
  readonly me: Player;
}): ReactNode {
  const { formatMessage } = useIntl();
  const { formatNumber, formatPercents } = useIntlNumbers();
  const { speed, errors, position, progress } = player;
  let laneElement: HTMLElement | null = null;
  let carElement: HTMLElement | null = null;
  const refPlayer = () => {
    if (laneElement != null && carElement != null) {
      const laneWidth = laneElement.offsetWidth;
      const carWidth = carElement.offsetWidth;
      carElement.style.insetInlineStart =
        String((laneWidth - carWidth) * player.progress) + "px";
    }
  };
  const refLane = (element: HTMLElement | null): void => {
    laneElement = element;
  };
  const refCar = (element: HTMLElement | null): void => {
    carElement = element;
  };
  return (
    <div
      ref={refPlayer}
      className={clsx(
        styles.player,
        player.finished && styles.isFinished,
        player.spectator && styles.isSpectator,
        player === me && styles.isMe,
      )}
    >
      <div className={styles.name}>
        <UserName user={player.user} />
      </div>
      <div ref={refLane} className={styles.lane}>
        <div ref={refCar} className={styles.car}>
          <CarImage className={styles.carImage} seed={player.id} />
        </div>
      </div>
      <div className={styles.details}>
        <NameValue
          title={formatMessage({
            id: "multiplayer.track.position.description",
            defaultMessage: "Position on the track.",
          })}
          name={formatMessage({
            id: "multiplayer.track.position.label",
            defaultMessage: "Position",
          })}
          value={
            <Value //
              className={styles.wideValue}
              value={positionName(position)}
            />
          }
        />
        <NameValue
          title={formatMessage({
            id: "multiplayer.track.distance.description",
            defaultMessage: "Distance completed.",
          })}
          name={formatMessage({
            id: "multiplayer.track.distance.label",
            defaultMessage: "Progress",
          })}
          value={
            <Value //
              className={styles.wideValue}
              value={formatPercents(progress, 1)}
            />
          }
        />
        <NameValue
          title={formatMessage({
            id: "multiplayer.track.name.description",
            defaultMessage: "Typing speed.",
          })}
          name={formatMessage({
            id: "multiplayer.track.name.label",
            defaultMessage: "Speed",
          })}
          value={
            <Value //
              className={styles.wideValue}
              value={formatNumber(speed)}
            />
          }
        />
        <NameValue
          title={formatMessage({
            id: "multiplayer.track.errors.description",
            defaultMessage: "Number of errors.",
          })}
          name={formatMessage({
            id: "multiplayer.track.errors.label",
            defaultMessage: "Errors",
          })}
          value={
            <Value //
              className={styles.wideValue}
              value={formatNumber(errors)}
            />
          }
        />
      </div>
    </div>
  );
});

export const FillerLane = memo(function FillerLane(): ReactNode {
  return <div className={clsx(styles.player, styles.isFiller)} />;
});
