export interface BroadcastPayload {
  message: string;
  messageType: "text" | "image" | "video";
  chatIds: string[];
  botId?: string;
  media?: File;
}

export interface BroadcastResult {
  success: boolean;
  message: string;
}

// Action Types
export const SEND_BROADCAST_REQUEST = "SEND_BROADCAST_REQUEST";
export const SEND_BROADCAST_SUCCESS = "SEND_BROADCAST_SUCCESS";
export const SEND_BROADCAST_FAILURE = "SEND_BROADCAST_FAILURE";
export const CLEAR_BROADCAST_RESULT = "CLEAR_BROADCAST_RESULT";

// Action Creators
export const sendBroadcastRequest = (payload: BroadcastPayload) => ({
  type: SEND_BROADCAST_REQUEST,
  payload,
});

export const sendBroadcastSuccess = (result: BroadcastResult) => ({
  type: SEND_BROADCAST_SUCCESS,
  payload: result,
});

export const sendBroadcastFailure = (error: string) => ({
  type: SEND_BROADCAST_FAILURE,
  payload: error,
});

export const clearBroadcastResult = () => ({
  type: CLEAR_BROADCAST_RESULT,
});
