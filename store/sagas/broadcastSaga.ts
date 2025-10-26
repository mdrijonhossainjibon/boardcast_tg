import { call, put, takeLatest } from "redux-saga/effects";
import {
  SEND_BROADCAST_REQUEST,
  sendBroadcastSuccess,
  sendBroadcastFailure,
} from "../actions/broadcastActions";

function* sendBroadcast(action: any) {
  try {
    const { message, messageType, chatIds, botId, media } = action.payload;
    
    console.log("Sending broadcast with:", { message, messageType, chatIds, botId, hasMedia: !!media });
    
    const formData = new FormData();
    formData.append("message", message);
    formData.append("messageType", messageType);
    formData.append("chatIds", JSON.stringify(chatIds));
    
    if (botId) {
      formData.append("botId", botId);
    }
    
    if (media && (messageType === "image" || messageType === "video")) {
      console.log("Appending media file:", media.name, media.type, media.size);
      formData.append("media", media);
    }

    // Log all FormData entries for debugging
    console.log("FormData entries:");
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}:`, { name: value.name, type: value.type, size: value.size });
      } else {
        console.log(`  ${key}:`, value);
      }
    }

    const response: Response = yield call(fetch, "/api/broadcast", {
      method: "POST",
      body: formData,
      // Don't set Content-Type header - browser will set it automatically with boundary
    });

    const data: { message: string; successful?: number; failed?: number; error?: string } = yield response.json();

    if (response.ok) {
      yield put(sendBroadcastSuccess({ success: true, message: data.message }));
    } else {
      yield put(sendBroadcastFailure(data.error || data.message || "Failed to send broadcast"));
    }
  } catch (error: any) {
    console.error("Broadcast saga error:", error);
    yield put(sendBroadcastFailure(error.message || "Network error occurred"));
  }
}

// Watcher saga
export function* broadcastSaga() {
  yield takeLatest(SEND_BROADCAST_REQUEST, sendBroadcast);
}
