import { mdiClose } from "@mdi/js";
import { clsx } from "clsx";
import {
  Children,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  useState,
} from "react";
import { useIntl } from "react-intl";
import { useHotkeys } from "../../hooks/use-hotkeys.ts";
import { useScreenScroll } from "../../hooks/use-screen-scroll.ts";
import { useScreenSize } from "../../hooks/use-screen-size.ts";
import { Icon } from "../icon/Icon.tsx";
import { Popup } from "../popup/Popup.tsx";
import { ScreenCover } from "../popup/ScreenCover.tsx";
import { Spotlight } from "../popup/Spotlight.tsx";
import { Portal } from "../portal/Portal.tsx";
import { Slide, type SlideProps } from "./Slide.tsx";
import * as styles from "./Tour.module.less";

export type TourProps = {
  readonly children?: readonly ReactElement<SlideProps>[];
  readonly onClose?: () => void;
};

export function Tour({ children, onClose }: TourProps): ReactNode {
  const { formatMessage } = useIntl();

  useScreenSize();
  useScreenScroll();

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
      <ScreenCover>
        <Spotlight anchor={anchor} />

        <Popup anchor={anchor} position={position}>
          <div className={styles.tour}>
            <a
              onClick={handleClickClose}
              href="#"
              className={styles.closeButton}
            >
              <Icon shape={mdiClose} />
            </a>

            {currentSlide}

            <div className={styles.footer}>
              <div className={styles.meter}>
                {slides.map((slide, index) => (
                  <span
                    key={index}
                    className={clsx(
                      styles.meterItem,
                      slideIndex === index && styles.meterItem_current,
                    )}
                  />
                ))}
              </div>
              {slideIndex > 0 && (
                <a
                  onClick={handleClickPrev}
                  href="#"
                  className={styles.prevButton}
                >
                  {formatMessage({
                    id: "tour.previous",
                    defaultMessage: "Previous",
                  })}
                </a>
              )}
              {(slideIndex < slides.length - 1 && (
                <a
                  onClick={handleClickNext}
                  href="#"
                  className={styles.nextButton}
                >
                  {formatMessage({
                    id: "tour.next",
                    defaultMessage: "Next",
                  })}
                </a>
              )) || (
                <a
                  onClick={handleClickClose}
                  href="#"
                  className={styles.nextButton}
                >
                  {formatMessage({
                    id: "tour.close",
                    defaultMessage: "Close",
                  })}
                </a>
              )}
            </div>
          </div>
        </Popup>
      </ScreenCover>
    </Portal>
  );
}
