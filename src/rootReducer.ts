import { routerReducer, RouterState } from 'react-router-redux';
import { combineReducers } from 'redux';
import recycleState from 'redux-recycle';

import appReducer, { initialState as appInitialState, AppState } from './app/reducer';
import authReducer, { AuthState, LOGOUT } from './auth/reducer';
import booksReducer, { initialState as booksInitialsState, BooksState } from './books/reducer';

export interface GlobalState {
  auth: AuthState;
  app: AppState;
  books: BooksState;
  router: RouterState;
}

export default combineReducers<GlobalState>({
  auth: authReducer,
  app: recycleState(appReducer, [LOGOUT], appInitialState),
  books: recycleState(booksReducer, [LOGOUT], booksInitialsState),
  router: routerReducer,
});
