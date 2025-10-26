import { combineReducers } from "redux";
import botReducer, { BotState } from "./botReducer";
import broadcastReducer, { BroadcastState } from "./broadcastReducer";

export interface RootState {
  bots: BotState;
  broadcast: BroadcastState;
}

const rootReducer = combineReducers({
  bots: botReducer,
  broadcast: broadcastReducer,
});

export default rootReducer;
