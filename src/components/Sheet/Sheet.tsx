import * as React from 'react';

import {CSSTransition} from 'react-transition-group';
import debounce from 'lodash/debounce';
import {classNames} from '@shopify/react-utilities/styles';

import {navigationBarCollapsed} from '../../utilities/breakpoints';
import {Key} from '../../types';
import {layer, overlay, Duration} from '../shared';
import {frameContextTypes, FrameContext} from '../Frame';
import {withAppProvider, WithAppProviderProps} from '../AppProvider';

import Backdrop from '../Backdrop';
import TrapFocus from '../TrapFocus';
import Portal from '../Portal';
import KeypressListener from '../KeypressListener';
import EventListener from '../EventListener';

import styles from './Sheet.scss';

export const BOTTOM_CLASS_NAMES = {
  enter: classNames(styles.Bottom, styles.enterBottom),
  enterActive: classNames(styles.Bottom, styles.enterBottomActive),
  exit: classNames(styles.Bottom, styles.exitBottom),
  exitActive: classNames(styles.Bottom, styles.exitBottomActive),
};

export const RIGHT_CLASS_NAMES = {
  enter: classNames(styles.Right, styles.enterRight),
  enterActive: classNames(styles.Right, styles.enterRightActive),
  exit: classNames(styles.Right, styles.exitRight),
  exitActive: classNames(styles.Right, styles.exitRightActive),
};

export interface Props {
  /** Whether or not the sheet is open */
  open: boolean;
  /** The child elements to render in the sheet. */
  children: React.ReactNode;
  /** Callback when the backdrop is clicked or `ESC` is pressed */
  onClose(): void;
}

export type ComposedProps = Props & WithAppProviderProps;

export interface State {
  mobile: boolean;
}

export class Sheet extends React.Component<ComposedProps, State> {
  static contextTypes = frameContextTypes;
  context: FrameContext;

  state: State = {
    mobile: false,
  };

  private handleResize = debounce(
    () => {
      const {mobile} = this.state;
      if (mobile !== isMobile()) {
        this.setState({mobile: !mobile});
      }
    },
    40,
    {leading: true, trailing: true, maxWait: 40},
  );

  componentDidMount() {
    const {
      state: {mobile},
      context: {frame},
      props: {
        polaris: {intl},
      },
    } = this;
    if (mobile !== isMobile()) {
      this.setState({mobile: !mobile});
    }

    if (!frame) {
      // eslint-disable-next-line no-console
      console.warn(intl.translate('Polaris.Sheet.warningMessage'));
    }
  }

  render() {
    const {
      props: {children, open, onClose},
      state: {mobile},
      context: {frame},
      handleResize,
    } = this;

    const sheetClassName = classNames(styles.Sheet, !mobile && styles.desktop);

    const containerClassName = classNames(
      styles.Container,
      !mobile && styles.desktop,
    );

    const sharedTransitionProps = {
      timeout: Duration.Slow,
      in: open,
      mountOnEnter: true,
      unmountOnExit: true,
    };

    const finalTransitionProps = {
      classNames: mobile ? BOTTOM_CLASS_NAMES : RIGHT_CLASS_NAMES,
      ...sharedTransitionProps,
    };

    const backdropMarkup = open ? (
      <Backdrop transparent onClick={onClose} />
    ) : null;

    return frame ? (
      <Portal idPrefix="sheet">
        <CSSTransition {...finalTransitionProps}>
          <Container
            containerClassName={containerClassName}
            open={open}
            sheetClassName={sheetClassName}
          >
            {children}
          </Container>
        </CSSTransition>
        <KeypressListener keyCode={Key.Escape} handler={onClose} />
        <EventListener event="resize" handler={handleResize} />
        {backdropMarkup}
      </Portal>
    ) : null;
  }
}

function isMobile(): boolean {
  return navigationBarCollapsed().matches;
}

function Container(props: {
  children: React.ReactNode;
  open: boolean;
  containerClassName: string;
  sheetClassName: string;
}) {
  return (
    <div
      className={props.containerClassName}
      {...layer.props}
      {...overlay.props}
    >
      <TrapFocus trapping={props.open}>
        <div role="dialog" tabIndex={-1} className={props.sheetClassName}>
          {props.children}
        </div>
      </TrapFocus>
    </div>
  );
}

export default withAppProvider<Props>()(Sheet);
