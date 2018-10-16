// @flow
import * as React from 'react';
import Button from 'component/button';
import WunderBar from 'component/wunderbar';
import * as icons from 'constants/icons';

type Props = {
  autoUpdateDownloaded: boolean,
  back: () => void,
  balance: string,
  downloadUpgradeRequested: any => void,
  forward: () => void,
  isBackDisabled: boolean,
  isForwardDisabled: boolean,
  isUpgradeAvailable: boolean,
  navigate: any => void,
  roundedBalance: string,
};

const Header = (props: Props) => {
  const {
    autoUpdateDownloaded,
    back,
    balance,
    downloadUpgradeRequested,
    forward,
    isBackDisabled,
    isForwardDisabled,
    isUpgradeAvailable,
    navigate,
    roundedBalance,
  } = props;

  const showUpgradeButton =
    autoUpdateDownloaded || (process.platform === 'linux' && isUpgradeAvailable);

  return (
    <header className="header">
      <div className="header__navigation">
        <Button
          className="header__navigation__item back"
          description={__('Navigate back')}
          disabled={isBackDisabled}
          onClick={back}
        />

        <Button
          className="header__navigation__item forward"
          description={__('Navigate forward')}
          disabled={isForwardDisabled}
          onClick={forward}
        />

        <Button
          className="header__navigation__item home"
          description={__('Home')}
          onClick={() => navigate('/discover')}
        />
      </div>

      <WunderBar />

      <div className="header__navigation">
        <Button
          className="header__navigation__item wallet"
          description={__('Your wallet')}
          iconRight="LBC"
          label={
            isUpgradeAvailable ? (
              `${balance}`
            ) : (
              <React.Fragment>
                <span className="btn__label--balance" title={`${balance} LBC`}>
                  You have
                </span>{' '}
                <span title={`${balance} LBC`}>{roundedBalance} LBC</span>
              </React.Fragment>
            )
          }
          onClick={() => navigate('/wallet')}
        />

        <Button
          className="header__navigation__item publish"
          description={__('Publish content')}
          disabled={isUpgradeAvailable} // TODO: Not sure if this works
          // label={isUpgradeAvailable ? '' : __('Publish')}
          onClick={() => navigate('/publish')}
        />

        {showUpgradeButton && (
          <Button
            button="primary"
            icon={icons.DOWNLOAD}
            label={__('Upgrade App')}
            onClick={downloadUpgradeRequested}
          />
        )}
      </div>
    </header>
  );
};

export default Header;
