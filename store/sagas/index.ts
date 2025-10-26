import { all } from "redux-saga/effects";
import { botSaga } from "./botSaga";
import { broadcastSaga } from "./broadcastSaga";

export default function* rootSaga() {
  yield all([
    botSaga(),
    broadcastSaga(),
  ]);
}
