// @flow
import * as React from 'react';
import { normalizeURI, convertToShareLink } from 'lbry-redux';
import type { Claim, Metadata } from 'types/claim';
import CardMedia from 'component/cardMedia';
import TruncatedText from 'component/common/truncated-text';
import Icon from 'component/common/icon';
import UriIndicator from 'component/uriIndicator';
import * as icons from 'constants/icons';
import classnames from 'classnames';
import FilePrice from 'component/filePrice';
import { openCopyLinkMenu } from 'util/contextMenu';

type Props = {
  uri: string,
  claim: ?Claim,
  fileInfo: ?{},
  metadata: ?Metadata,
  navigate: (string, ?{}) => void,
  rewardedContentClaimIds: Array<string>,
  obscureNsfw: boolean,
  claimIsMine: boolean,
  pending?: boolean,
  /* eslint-disable react/no-unused-prop-types */
  resolveUri: string => void,
  isResolvingUri: boolean,
  showPrice: boolean,
  /* eslint-enable react/no-unused-prop-types */
};

class FileCard extends React.PureComponent<Props> {
  static defaultProps = {
    showPrice: true,
  };

  componentWillMount() {
    this.resolve(this.props);
  }

  componentWillReceiveProps(nextProps: Props) {
    this.resolve(nextProps);
  }

  resolve = (props: Props) => {
    const { isResolvingUri, resolveUri, claim, uri, pending } = props;

    if (!pending && !isResolvingUri && claim === undefined && uri) {
      resolveUri(uri);
    }
  };

  render() {
    const {
      claim,
      fileInfo,
      metadata,
      navigate,
      rewardedContentClaimIds,
      obscureNsfw,
      claimIsMine,
      pending,
      showPrice,
    } = this.props;

    const shouldHide = !claimIsMine && !pending && obscureNsfw && metadata && metadata.nsfw;
    if (shouldHide) {
      return null;
    }

    const IconBadge = props => {
      const color = props.color || '#111';

      return (
        <svg height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
          <g
            fill="none"
            fillRule="evenodd"
            stroke="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="8" stroke={color} />
            <path
              d="M9.856, 4L6.144, 6.144L4, 9.856L4, 14.144L6.144, 17.856L9.856, 20L14.144, 20L17.856, 17.856L20, 14.144L20, 9.856L17.856, 6.144L14.144, 4L9.856, 4ZM9.675, 3.325L12, 1L14.325, 3.325L17.5, 2.474L18.351, 5.649L21.526, 6.5L20.675, 9.675L23, 12L20.675, 14.325L21.526, 17.5L18.351, 18.351L17.5, 21.526L14.325, 20.675L12, 23L9.675, 20.675L6.5, 21.526L5.649, 18.351L2.474, 17.5L3.325, 14.325L1, 12L3.325, 9.675L2.474, 6.5L5.649, 5.649L6.5, 2.474L9.675, 3.325Z"
              fill={color}
            />
            <path
              d="M12, 13.988L9.649, 15.236L10.109, 12.614L8.196, 10.764L10.832, 10.392L12, 8L13.168, 10.392L15.804, 10.764L13.891, 12.614L14.351, 15.236L12, 13.988Z"
              fill={color}
            />
          </g>
        </svg>
      );
    };

    const uri = !pending ? normalizeURI(this.props.uri) : this.props.uri;
    const title = metadata && metadata.title ? metadata.title : uri;
    const thumbnail = metadata && metadata.thumbnail ? metadata.thumbnail : null;
    const isRewardContent = claim && rewardedContentClaimIds.includes(claim.claim_id);
    const handleContextMenu = event => {
      event.preventDefault();
      event.stopPropagation();
      openCopyLinkMenu(convertToShareLink(uri), event);
    };

    // We should be able to tab through cards
    /* eslint-disable jsx-a11y/click-events-have-key-events */
    return (
      <li
        className={classnames('card small', {
          'link': !pending,
          'pending': pending,
        })}
        onClick={!pending ? () => navigate('/show', { uri }) : () => {}}
        onContextMenu={handleContextMenu}
        role="button"
        tabIndex="0"
      >
        <CardMedia thumbnail={thumbnail} />
        <div className="card__meta identity">
          <div className="card__meta__title small file-card">
            <TruncatedText lines={2}>{title}</TruncatedText>
          </div>
          <div className="card__meta__subtitle">
            {pending ? <div>Pending...</div> : <UriIndicator uri={uri} link />}
          </div>
          <div className="card__meta__properties">
            {showPrice && <FilePrice hideFree uri={uri} />}
            {isRewardContent && <IconBadge color="#d22727" />}
            {fileInfo && <Icon icon={icons.LOCAL} />}
          </div>
        </div>
      </li>
    );
    /* eslint-enable jsx-a11y/click-events-have-key-events */
  }
}

export default FileCard;
