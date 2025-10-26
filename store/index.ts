import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import rootReducer, { RootState } from "./reducers";
import rootSaga from "./sagas";

const sagaMiddleware = createSagaMiddleware();

// Redux DevTools Extension
const composeEnhancers =
  (typeof window !== "undefined" &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

export const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(rootSaga);

export type AppDispatch = typeof store.dispatch;
export type { RootState };
