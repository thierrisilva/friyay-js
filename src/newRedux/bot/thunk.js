import api from './apiCalls';
import { getCommandStatusAttributes } from './selectors';
import { fetchBot, setCommandResponse, fetchUsersAndTopics } from './actions';
import { failure } from 'Utils/toast';

export const getBotPanelData = () => async dispatch => {
  try {
    const { data } = await api.fetchBot();
    dispatch(fetchBot(data));
  } catch (error) {
    failure('Could not get Bot Data');
    return null;
  }
};

export const postBotCommands = ({ command }) => async dispatch => {
  try {
    const { data } = await api.postCommands(command);
    const commandArray = command.text.split(' ');
    const statusType =
      commandArray[0].toLowerCase() == 'status'
        ? commandArray[0]
        : `${commandArray[0]} ${commandArray[1]}`.toLowerCase() !== 'cards in'
        ? `${commandArray[0]} ${commandArray[1]}`
        : `${commandArray[0]} ${commandArray[1]} ${commandArray[2]}`;

    if (data.message) return failure(data.message);

    dispatch(
      setCommandResponse(
        getCommandStatusAttributes({
          ...data,
          statusType,
          commandType: command.type
        })
      )
    );
    return;
  } catch (error) {
    failure('Could not get Bot command Data');
    return null;
  }
};

export const getCommandInputUsersAndTopics = query => async dispatch => {
  try {
    const { data } = await api.fetchUsersAndTopics(query);
    dispatch(fetchUsersAndTopics(data));
  } catch (error) {
    failure('Could not get users and yays');
    return null;
  }
};
