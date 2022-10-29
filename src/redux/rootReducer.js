import { combineReducers } from 'redux';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
// slices
import companyReducer from './slices/company';
import userReducer from './slices/user';
import categoryReducer from './slices/category';
import itemReducer from './slices/item';
import issueReducer from './slices/issue';
import dataReducer from './slices/data';
import insightsReducer from './slices/insights';

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
  whitelist: ['company', 'user', 'data', 'item', 'category', 'issue', 'insight'],
};

const rootReducer = combineReducers({
  company: companyReducer,
  user: userReducer,
  category: categoryReducer,
  item: itemReducer,
  issue: issueReducer,
  bulk: dataReducer,
  insight: insightsReducer,
});

export { rootPersistConfig, rootReducer };
