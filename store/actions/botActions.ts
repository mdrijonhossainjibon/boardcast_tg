export interface BotConfig {
  id: string;
  name: string;
  token: string;
  active: boolean;
}

// Action Types
export const FETCH_BOTS_REQUEST = "FETCH_BOTS_REQUEST";
export const FETCH_BOTS_SUCCESS = "FETCH_BOTS_SUCCESS";
export const FETCH_BOTS_FAILURE = "FETCH_BOTS_FAILURE";

export const CREATE_BOT_REQUEST = "CREATE_BOT_REQUEST";
export const CREATE_BOT_SUCCESS = "CREATE_BOT_SUCCESS";
export const CREATE_BOT_FAILURE = "CREATE_BOT_FAILURE";

export const UPDATE_BOT_REQUEST = "UPDATE_BOT_REQUEST";
export const UPDATE_BOT_SUCCESS = "UPDATE_BOT_SUCCESS";
export const UPDATE_BOT_FAILURE = "UPDATE_BOT_FAILURE";

export const DELETE_BOT_REQUEST = "DELETE_BOT_REQUEST";
export const DELETE_BOT_SUCCESS = "DELETE_BOT_SUCCESS";
export const DELETE_BOT_FAILURE = "DELETE_BOT_FAILURE";

export const TOGGLE_BOT_ACTIVE_REQUEST = "TOGGLE_BOT_ACTIVE_REQUEST";
export const TOGGLE_BOT_ACTIVE_SUCCESS = "TOGGLE_BOT_ACTIVE_SUCCESS";
export const TOGGLE_BOT_ACTIVE_FAILURE = "TOGGLE_BOT_ACTIVE_FAILURE";

export const SET_SELECTED_BOT_ID = "SET_SELECTED_BOT_ID";
export const SET_EDITING_BOT_ID = "SET_EDITING_BOT_ID";
export const UPDATE_BOT_LOCAL = "UPDATE_BOT_LOCAL";

// Action Creators
export const fetchBotsRequest = () => ({
  type: FETCH_BOTS_REQUEST,
});

export const fetchBotsSuccess = (bots: BotConfig[]) => ({
  type: FETCH_BOTS_SUCCESS,
  payload: bots,
});

export const fetchBotsFailure = (error: string) => ({
  type: FETCH_BOTS_FAILURE,
  payload: error,
});

export const createBotRequest = (bot: Partial<BotConfig>) => ({
  type: CREATE_BOT_REQUEST,
  payload: bot,
});

export const createBotSuccess = (bot: BotConfig) => ({
  type: CREATE_BOT_SUCCESS,
  payload: bot,
});

export const createBotFailure = (error: string) => ({
  type: CREATE_BOT_FAILURE,
  payload: error,
});

export const updateBotRequest = (bot: BotConfig) => ({
  type: UPDATE_BOT_REQUEST,
  payload: bot,
});

export const updateBotSuccess = (bot: BotConfig) => ({
  type: UPDATE_BOT_SUCCESS,
  payload: bot,
});

export const updateBotFailure = (error: string) => ({
  type: UPDATE_BOT_FAILURE,
  payload: error,
});

export const deleteBotRequest = (botId: string) => ({
  type: DELETE_BOT_REQUEST,
  payload: botId,
});

export const deleteBotSuccess = (botId: string) => ({
  type: DELETE_BOT_SUCCESS,
  payload: botId,
});

export const deleteBotFailure = (error: string) => ({
  type: DELETE_BOT_FAILURE,
  payload: error,
});

export const toggleBotActiveRequest = (bot: BotConfig) => ({
  type: TOGGLE_BOT_ACTIVE_REQUEST,
  payload: bot,
});

export const toggleBotActiveSuccess = (bot: BotConfig) => ({
  type: TOGGLE_BOT_ACTIVE_SUCCESS,
  payload: bot,
});

export const toggleBotActiveFailure = (error: string) => ({
  type: TOGGLE_BOT_ACTIVE_FAILURE,
  payload: error,
});

export const setSelectedBotId = (botId: string) => ({
  type: SET_SELECTED_BOT_ID,
  payload: botId,
});

export const setEditingBotId = (botId: string | null) => ({
  type: SET_EDITING_BOT_ID,
  payload: botId,
});

export const updateBotLocal = (bot: BotConfig) => ({
  type: UPDATE_BOT_LOCAL,
  payload: bot,
});
