import {
  BotConfig,
  FETCH_BOTS_REQUEST,
  FETCH_BOTS_SUCCESS,
  FETCH_BOTS_FAILURE,
  CREATE_BOT_REQUEST,
  CREATE_BOT_SUCCESS,
  CREATE_BOT_FAILURE,
  UPDATE_BOT_REQUEST,
  UPDATE_BOT_SUCCESS,
  UPDATE_BOT_FAILURE,
  DELETE_BOT_REQUEST,
  DELETE_BOT_SUCCESS,
  DELETE_BOT_FAILURE,
  TOGGLE_BOT_ACTIVE_REQUEST,
  TOGGLE_BOT_ACTIVE_SUCCESS,
  TOGGLE_BOT_ACTIVE_FAILURE,
  SET_SELECTED_BOT_ID,
  SET_EDITING_BOT_ID,
  UPDATE_BOT_LOCAL,
} from "../actions/botActions";

export interface BotState {
  bots: BotConfig[];
  selectedBotId: string;
  editingBotId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: BotState = {
  bots: [],
  selectedBotId: "",
  editingBotId: null,
  loading: false,
  error: null,
};

export default function botReducer(state = initialState, action: any): BotState {
  switch (action.type) {
    case FETCH_BOTS_REQUEST:
    case CREATE_BOT_REQUEST:
    case UPDATE_BOT_REQUEST:
    case DELETE_BOT_REQUEST:
    case TOGGLE_BOT_ACTIVE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_BOTS_SUCCESS:
      const firstActiveBot = action.payload.find((b: BotConfig) => b.active);
      return {
        ...state,
        loading: false,
        bots: action.payload,
        selectedBotId: firstActiveBot && !state.selectedBotId ? firstActiveBot.id : state.selectedBotId,
      };

    case CREATE_BOT_SUCCESS:
      return {
        ...state,
        loading: false,
        bots: [...state.bots, action.payload],
        editingBotId: action.payload.id,
      };

    case UPDATE_BOT_SUCCESS:
    case TOGGLE_BOT_ACTIVE_SUCCESS:
      return {
        ...state,
        loading: false,
        bots: state.bots.map((bot) =>
          bot.id === action.payload.id ? action.payload : bot
        ),
        editingBotId: action.type === UPDATE_BOT_SUCCESS ? null : state.editingBotId,
      };

    case DELETE_BOT_SUCCESS:
      return {
        ...state,
        loading: false,
        bots: state.bots.filter((bot) => bot.id !== action.payload),
        selectedBotId: state.selectedBotId === action.payload ? "" : state.selectedBotId,
      };

    case FETCH_BOTS_FAILURE:
    case CREATE_BOT_FAILURE:
    case UPDATE_BOT_FAILURE:
    case DELETE_BOT_FAILURE:
    case TOGGLE_BOT_ACTIVE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case SET_SELECTED_BOT_ID:
      return {
        ...state,
        selectedBotId: action.payload,
      };

    case SET_EDITING_BOT_ID:
      return {
        ...state,
        editingBotId: action.payload,
      };

    case UPDATE_BOT_LOCAL:
      return {
        ...state,
        bots: state.bots.map((bot) =>
          bot.id === action.payload.id ? action.payload : bot
        ),
      };

    default:
      return state;
  }
}
