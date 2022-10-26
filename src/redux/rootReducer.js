import { combineReducers } from 'redux';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
// slices
import companyReducer from './slices/company';
import userReducer from './slices/user';
import categoryReducer from './slices/category';
import itemReducer from './slices/item';
import issueReducer from './slices/issue';

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
  whitelist: ['company', 'user'],
};

const rootReducer = combineReducers({
  company: companyReducer,
  user: userReducer,
  category: categoryReducer,
  item: itemReducer,
  issue: issueReducer,
});

export { rootPersistConfig, rootReducer };
