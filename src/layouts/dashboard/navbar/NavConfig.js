// routes
import { PATH_ADMIN } from '../../../routes/paths';
// components
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const getIcon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  ecommerce: getIcon('ic_ecommerce'),
  user: getIcon('ic_user'),
  analytics: getIcon('ic_analytics'),
  issue: getIcon('ic_booking'),
  item: getIcon('ic_ecommerce'),
  category: getIcon('ic_menu_item'),
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'Admin',
    role: 'admin',
    items: [
      { title: 'Analytics', path: PATH_ADMIN.company.root, icon: ICONS.analytics },
      { title: 'Categories', path: PATH_ADMIN.category.root, icon: ICONS.category },
      { title: 'Items', path: PATH_ADMIN.item.root, icon: ICONS.item },
      { title: 'Issues', path: PATH_ADMIN.issue.root, icon: ICONS.issue },
      { title: 'Users', path: PATH_ADMIN.user.root, icon: ICONS.user },
    ],
  },
];

export default navConfig;
