import { connect } from 'react-redux';
import {
  makeSelectClaimRewardError,
  makeSelectRewardByType,
  makeSelectIsRewardClaimPending,
  doClaimRewardType,
  doClaimRewardClearError,
} from 'lbryinc';
import { doNavigate } from 'redux/actions/navigation';
import RewardLink from './view';

const makeSelect = () => {
  const selectIsPending = makeSelectIsRewardClaimPending();
  const selectReward = makeSelectRewardByType();
  const selectError = makeSelectClaimRewardError();

  const select = (state, props) => ({
    errorMessage: selectError(state, props),
    isPending: selectIsPending(state, props),
    reward: selectReward(state, props.reward_type),
  });

  return select;
};

const perform = dispatch => ({
  claimReward: reward => dispatch(doClaimRewardType(reward.reward_type)),
  clearError: reward => dispatch(doClaimRewardClearError(reward)),
  navigate: path => dispatch(doNavigate(path)),
});

export default connect(
  makeSelect,
  perform
)(RewardLink);
