// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';
const ROOTS_ADMIN = '/admin';
const ROOTS_USER = '/user';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  register: path(ROOTS_AUTH, '/register'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  verify: path(ROOTS_AUTH, '/verify'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  newPassword: path(ROOTS_AUTH, '/new-password'),
};

export const PATH_PAGE = {
  page403: '/403',
  page404: '/404',
  page500: '/500',
};

export const PATH_ADMIN = {
  root: ROOTS_ADMIN,
  company: {
    root: path(ROOTS_ADMIN, '/company'),
    new: path(ROOTS_ADMIN, '/company/new'),
    list: path(ROOTS_ADMIN, '/company/list'),
    profile: path(ROOTS_ADMIN, '/company/profile'),
    edit: (id) => path(ROOTS_ADMIN, `/company/${id}/edit`),
  },
  insights: {
    root: path(ROOTS_ADMIN, '/insights'),
  },
  user: {
    root: path(ROOTS_ADMIN, '/user'),
    new: path(ROOTS_ADMIN, '/user/new'),
    list: path(ROOTS_ADMIN, '/user/list'),
    profile: path(ROOTS_ADMIN, '/user/profile'),
    edit: (id) => path(ROOTS_ADMIN, `/user/${id}/edit`),
  },
  category: {
    root: path(ROOTS_ADMIN, '/category'),
    new: path(ROOTS_ADMIN, '/category/new'),
    list: path(ROOTS_ADMIN, '/category/list'),
    profile: path(ROOTS_ADMIN, '/category/profile'),
    edit: (id) => path(ROOTS_ADMIN, `/category/${id}/edit`),
  },
  item: {
    root: path(ROOTS_ADMIN, '/item'),
    new: path(ROOTS_ADMIN, '/item/new'),
    list: path(ROOTS_ADMIN, '/item/list'),
    profile: path(ROOTS_ADMIN, '/item/profile'),
    edit: (id) => path(ROOTS_ADMIN, `/item/${id}/edit`),
    view: (id) => path(ROOTS_ADMIN, `/item/${id}`),
    newIssue: (id) => path(ROOTS_ADMIN, `/issue/new?itemId=${id}`),
  },
  issue: {
    root: path(ROOTS_ADMIN, '/issue'),
    new: path(ROOTS_ADMIN, '/issue/new'),
    list: path(ROOTS_ADMIN, '/issue/list'),
    profile: path(ROOTS_ADMIN, '/issue/profile'),
    edit: (id) => path(ROOTS_ADMIN, `/issue/${id}/edit`),
    view: (id) => path(ROOTS_ADMIN, `/issue/${id}`),
  },
};

export const PATH_USER = {
  root: path(ROOTS_USER, '/'),
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  permissionDenied: path(ROOTS_DASHBOARD, '/permission-denied'),
};
