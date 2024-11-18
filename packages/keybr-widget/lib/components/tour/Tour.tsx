import { mdiClose } from "@mdi/js";
import { Children, type ReactElement, type ReactNode, useState } from "react";
import { useIntl } from "react-intl";
import { useHotkeys } from "../../hooks/use-hotkeys.ts";
import { LinkButton } from "../button/LinkButton.tsx";
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

  const selectPrev = () => {
    if (slideIndex > 0) {
      setSlideIndex(slideIndex - 1);
    }
  };

  const selectNext = () => {
    if (slideIndex < length - 1) {
      setSlideIndex(slideIndex + 1);
    }
  };

  const close = () => {
    onClose?.();
  };

  useHotkeys({
    ["ArrowLeft"]: selectPrev,
    ["ArrowUp"]: selectPrev,
    ["PageUp"]: selectPrev,
    ["Backspace"]: selectPrev,
    ["ArrowRight"]: selectNext,
    ["ArrowDown"]: selectNext,
    ["PageDown"]: selectNext,
    ["Space"]: selectNext,
    ["Escape"]: close,
  });

  const { anchor, position } = currentSlide.props;

  return (
    <Portal>
      <Backdrop>
        <Spotlight anchor={anchor} />

        <Popup {...props} anchor={anchor} position={position} offset={30}>
          <div className={styles.root}>
            {currentSlide}

            <LinkButton className={styles.close} onClick={close}>
              <Icon shape={mdiClose} />
            </LinkButton>

            <div className={styles.footer}>
              <Meter length={slides.length} slideIndex={slideIndex} />

              {slideIndex > 0 && (
                <LinkButton className={styles.prev} onClick={selectPrev}>
                  {formatMessage({
                    id: "tour.previous",
                    defaultMessage: "Previous",
                  })}
                </LinkButton>
              )}

              {(slideIndex < slides.length - 1 && (
                <LinkButton className={styles.next} onClick={selectNext}>
                  {formatMessage({
                    id: "tour.next",
                    defaultMessage: "Next",
                  })}
                </LinkButton>
              )) || (
                <LinkButton className={styles.next} onClick={close}>
                  {formatMessage({
                    id: "tour.close",
                    defaultMessage: "Close",
                  })}
                </LinkButton>
              )}
            </div>
          </div>
        </Popup>
      </Backdrop>
    </Portal>
  );
}
