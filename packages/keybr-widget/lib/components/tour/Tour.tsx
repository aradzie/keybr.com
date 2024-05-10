import { mdiClose } from "@mdi/js";
import {
  Children,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  useState,
} from "react";
import { useIntl } from "react-intl";
import { useHotkeys } from "../../hooks/use-hotkeys.ts";
import { Icon } from "../icon/Icon.tsx";
import { Backdrop } from "../popup/Backdrop.tsx";
import { Popup } from "../popup/Popup.tsx";
import { Spotlight } from "../popup/Spotlight.tsx";
import { Portal } from "../portal/Portal.tsx";
import { Meter } from "./Meter.tsx";
import { Slide, type SlideProps } from "./Slide.tsx";
import * as styles from "./Tour.module.less";

export type TourProps = {
  readonly children?: readonly ReactElement<SlideProps>[];
  readonly onClose?: () => void;
};

export function Tour({ children, onClose, ...props }: TourProps): ReactNode {
  const { formatMessage } = useIntl();

  const [slideIndex, setSlideIndex] = useState(0);

  const slides = Children.toArray(children) as ReactElement<SlideProps>[];
  const { length } = slides;
  if (length > 0 && slideIndex > length - 1) {
    setSlideIndex(length - 1);
  }
  if (length > 0 && slideIndex < 0) {
    setSlideIndex(0);
  }
  const currentSlide =
    slideIndex >= 0 && slideIndex < length ? slides[slideIndex] : <Slide />;

  const selectPrev = (): void => {
    if (slideIndex > 0) {
      setSlideIndex(slideIndex - 1);
    }
  };

  const selectNext = (): void => {
    if (slideIndex < length - 1) {
      setSlideIndex(slideIndex + 1);
    }
  };

  const close = (): void => {
    onClose?.();
  };

  useHotkeys(
    ["ArrowLeft", selectPrev],
    ["ArrowUp", selectPrev],
    ["PageUp", selectPrev],
    ["Backspace", selectPrev],
    ["ArrowRight", selectNext],
    ["ArrowDown", selectNext],
    ["PageDown", selectNext],
    ["Space", selectNext],
    ["Escape", close],
  );

  const handleClickPrev = (event: MouseEvent): void => {
    event.preventDefault();
    selectPrev();
  };

  const handleClickNext = (event: MouseEvent): void => {
    event.preventDefault();
    selectNext();
  };

  const handleClickClose = (event: MouseEvent): void => {
    event.preventDefault();
    close();
  };

  const { anchor, position } = currentSlide.props;

  return (
    <Portal>
      <Backdrop>
        <Spotlight anchor={anchor} />

        <Popup {...props} anchor={anchor} position={position} offset={30}>
          <div className={styles.root}>
            {currentSlide}

            <a className={styles.close} href="#" onClick={handleClickClose}>
              <Icon shape={mdiClose} />
            </a>

            <div className={styles.footer}>
              <Meter length={slides.length} slideIndex={slideIndex} />

              {slideIndex > 0 && (
                <a className={styles.prev} href="#" onClick={handleClickPrev}>
                  {formatMessage({
                    id: "tour.previous",
                    defaultMessage: "Previous",
                  })}
                </a>
              )}

              {(slideIndex < slides.length - 1 && (
                <a className={styles.next} href="#" onClick={handleClickNext}>
                  {formatMessage({
                    id: "tour.next",
                    defaultMessage: "Next",
                  })}
                </a>
              )) || (
                <a className={styles.next} href="#" onClick={handleClickClose}>
                  {formatMessage({
                    id: "tour.close",
                    defaultMessage: "Close",
                  })}
                </a>
              )}
            </div>
          </div>
        </Popup>
      </Backdrop>
    </Portal>
  );
}
