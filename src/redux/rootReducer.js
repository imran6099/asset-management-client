import { combineReducers } from 'redux';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
// slices
import userReducer from './slices/user';
import categoryReducer from './slices/category';
import itemReducer from './slices/item';
import issueReducer from './slices/issue';
import dataReducer from './slices/data';
import insightsReducer from './slices/insights';
import transferReducer from './slices/transfer';
import loanReducer from './slices/loan';

// ----------------------------------------------------------------------

const createNoopStorage = () => ({
  getItem() {
    return Promise.resolve(null);
  },
  setItem(_key, value) {
    return Promise.resolve(value);
  },
  removeItem() {
    return Promise.resolve();
  },
});

const storage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage();

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['userBase', 'data', 'item', 'category', 'issue', 'insight', 'transfer', 'loan'],
};

const rootReducer = combineReducers({
  userBase: userReducer,
  category: categoryReducer,
  item: itemReducer,
  issue: issueReducer,
  bulk: dataReducer,
  insight: insightsReducer,
  transfer: transferReducer,
  loan: loanReducer,
});

export { rootPersistConfig, rootReducer };
