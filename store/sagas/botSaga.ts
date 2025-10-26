import { call, put, takeLatest } from "redux-saga/effects";
import {
  BotConfig,
  FETCH_BOTS_REQUEST,
  CREATE_BOT_REQUEST,
  UPDATE_BOT_REQUEST,
  DELETE_BOT_REQUEST,
  TOGGLE_BOT_ACTIVE_REQUEST,
  fetchBotsSuccess,
  fetchBotsFailure,
  createBotSuccess,
  createBotFailure,
  updateBotSuccess,
  updateBotFailure,
  deleteBotSuccess,
  deleteBotFailure,
  toggleBotActiveSuccess,
  toggleBotActiveFailure,
} from "../actions/botActions";

// API calls
function* fetchBots() {
  try {
    const response: Response = yield call(fetch, "/api/bots");
    const data: { success: boolean; bots: BotConfig[] } = yield response.json();
    
    if (data.success) {
      yield put(fetchBotsSuccess(data.bots));
    } else {
      yield put(fetchBotsFailure("Failed to fetch bots"));
    }
  } catch (error: any) {
    yield put(fetchBotsFailure(error.message || "Failed to fetch bots"));
  }
}

function* createBot(action: any) {
  try {
    const response: Response = yield call(fetch, "/api/bots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(action.payload),
    });
    const data: { success: boolean; bot: BotConfig } = yield response.json();
    
    if (data.success) {
      yield put(createBotSuccess(data.bot));
    } else {
      yield put(createBotFailure("Failed to create bot"));
    }
  } catch (error: any) {
    yield put(createBotFailure(error.message || "Failed to create bot"));
  }
}

function* updateBot(action: any) {
  try {
    const response: Response = yield call(fetch, `/api/bots/${action.payload.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(action.payload),
    });
    const data: { success: boolean; bot: BotConfig } = yield response.json();
    
    if (data.success) {
      yield put(updateBotSuccess(data.bot));
    } else {
      yield put(updateBotFailure("Failed to update bot"));
    }
  } catch (error: any) {
    yield put(updateBotFailure(error.message || "Failed to update bot"));
  }
}

function* deleteBot(action: any) {
  try {
    const response: Response = yield call(fetch, `/api/bots/${action.payload}`, {
      method: "DELETE",
    });
    const data: { success: boolean } = yield response.json();
    
    if (data.success) {
      yield put(deleteBotSuccess(action.payload));
    } else {
      yield put(deleteBotFailure("Failed to delete bot"));
    }
  } catch (error: any) {
    yield put(deleteBotFailure(error.message || "Failed to delete bot"));
  }
}

function* toggleBotActive(action: any) {
  try {
    const updatedBot = { ...action.payload, active: !action.payload.active };
    const response: Response = yield call(fetch, `/api/bots/${action.payload.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedBot),
    });
    const data: { success: boolean; bot: BotConfig } = yield response.json();
    
    if (data.success) {
      yield put(toggleBotActiveSuccess(data.bot));
    } else {
      yield put(toggleBotActiveFailure("Failed to toggle bot status"));
    }
  } catch (error: any) {
    yield put(toggleBotActiveFailure(error.message || "Failed to toggle bot status"));
  }
}

// Watcher saga
export function* botSaga() {
  yield takeLatest(FETCH_BOTS_REQUEST, fetchBots);
  yield takeLatest(CREATE_BOT_REQUEST, createBot);
  yield takeLatest(UPDATE_BOT_REQUEST, updateBot);
  yield takeLatest(DELETE_BOT_REQUEST, deleteBot);
  yield takeLatest(TOGGLE_BOT_ACTIVE_REQUEST, toggleBotActive);
}
