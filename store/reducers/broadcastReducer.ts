import {
  BroadcastResult,
  SEND_BROADCAST_REQUEST,
  SEND_BROADCAST_SUCCESS,
  SEND_BROADCAST_FAILURE,
  CLEAR_BROADCAST_RESULT,
} from "../actions/broadcastActions";

export interface BroadcastState {
  loading: boolean;
  result: BroadcastResult | null;
  error: string | null;
}

const initialState: BroadcastState = {
  loading: false,
  result: null,
  error: null,
};

export default function broadcastReducer(state = initialState, action: any): BroadcastState {
  switch (action.type) {
    case SEND_BROADCAST_REQUEST:
      return {
        ...state,
        loading: true,
        result: null,
        error: null,
      };

    case SEND_BROADCAST_SUCCESS:
      return {
        ...state,
        loading: false,
        result: action.payload,
      };

    case SEND_BROADCAST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        result: { success: false, message: action.payload },
      };

    case CLEAR_BROADCAST_RESULT:
      return {
        ...state,
        result: null,
        error: null,
      };

    default:
      return state;
  }
}
