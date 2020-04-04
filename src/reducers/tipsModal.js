import { switchcaseF } from './utils';
import { not } from 'ramda';
import { 
  SET_TIP_MODAL_ACTIVE,
  SET_TIP_EDIT_ACTIVE,
  SET_TIP_MODAL_HIDDEN,
  SET_TIP_EDIT_HIDDEN,
  TOGGLE_TIP_RELATED,
  RESET_TIP_MODAL,
  SET_TIP_CREATE_ACTIVE,
  SET_TIP_CREATE_HIDDEN
} from 'AppConstants';

const initialState = {
  isCreating: false,
  isEditing: false,
  isVisible: false,
  isRelated: false,
  isEmptyState: false,
  newTipTopicId: null,
  newTipTipId: null,
};
const setModalActive = state => ({ ...state, isVisible: true });
const setModalHidden = state => ({ ...state, isVisible: false });
const setEditActive = state => ({ ...state, isEditing: true });
const setEditHidden = state => ({ ...state, isEditing: false });
const setCreateActive = (state, {topicId, parentTipId}) => ({
  ...state, 
  newTipTopicId: topicId,
  newTipTipId: parentTipId,
  isCreating: true 
});
const setCreateHidden = state => ({
  ...state, 
  newTipTopicId: null,
  newTipTipId: null,
  isCreating: false 
});

const toggleRelated = state => ({ ...state, isRelated: not(state.isRelated) });
const resetModal = () => initialState;

const tipsModal = (state = initialState, { type, payload }) => 
  switchcaseF({
    [SET_TIP_MODAL_ACTIVE]: setModalActive,
    [SET_TIP_MODAL_HIDDEN]: setModalHidden,
    [SET_TIP_EDIT_ACTIVE]: setEditActive,
    [SET_TIP_EDIT_HIDDEN]: setEditHidden,
    [SET_TIP_CREATE_ACTIVE]: setCreateActive,
    [SET_TIP_CREATE_HIDDEN]: setCreateHidden,
    [TOGGLE_TIP_RELATED]: toggleRelated,
    [RESET_TIP_MODAL]: resetModal  
  })(state)(type)(state, payload);

export default tipsModal;