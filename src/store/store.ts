import { configureStore } from '@reduxjs/toolkit';
import commentsReducer from './slices/commentsSlice';
import createSagaMiddleware from 'redux-saga';
import saga from "./sagas/saga"

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
    reducer: {
        comments: commentsReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat([sagaMiddleware]),
});

sagaMiddleware.run(saga);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
