const menuData = [
  {
    path: '/dashboard',
    name: 'dashboard',
    icon: 'dashboard',
    routes: [
      {
        path: '/dashboard/analysis',
        name: 'analysis',
      },
      {
        path: '/dashboard/monitor',
        name: 'monitor',
      },
      {
        path: '/dashboard/workplace',
        name: 'workplace',
      },
    ],
  },
  // forms
  // {
  //   path: '/form',
  //   icon: 'form',
  //   name: 'form',
  //   routes: [
  //     {
  //       path: '/form/basic-form',
  //       name: 'basicform',
  //     },
  //     {
  //       path: '/form/step-form',
  //       name: 'stepform',
  //       hideChildrenInMenu: true,
  //       routes: [
  //         {
  //           path: '/form/step-form',
  //           redirect: '/form/step-form/info',
  //         },
  //         {
  //           path: '/form/step-form/info',
  //           name: 'info',
  //         },
  //         {
  //           path: '/form/step-form/confirm',
  //           name: 'confirm',
  //         },
  //         {
  //           path: '/form/step-form/result',
  //           name: 'result',
  //         },
  //       ],
  //     },
  //     {
  //       path: '/form/advanced-form',
  //       name: 'advancedform',
  //       authority: ['admin'],
  //     },
  //   ],
  // },
  // // list
  // {
  //   path: '/list',
  //   icon: 'table',
  //   name: 'list',
  //   routes: [
  //     {
  //       path: '/list/table-list',
  //       name: 'searchtable',
  //     },
  //     {
  //       path: '/list/basic-list',
  //       name: 'basiclist',
  //     },
  //     {
  //       path: '/list/card-list',
  //       name: 'cardlist',
  //     },
  //     {
  //       path: '/list/search',
  //       name: 'searchlist',
  //       component: './List/List',
  //       routes: [
  //         {
  //           path: '/list/search',
  //           redirect: '/list/search/articles',
  //         },
  //         {
  //           path: '/list/search/articles',
  //           name: 'articles',
  //         },
  //         {
  //           path: '/list/search/projects',
  //           name: 'projects',
  //         },
  //         {
  //           path: '/list/search/applications',
  //           name: 'applications',
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   path: '/profile',
  //   name: 'profile',
  //   icon: 'profile',
  //   routes: [
  //     // profile
  //     {
  //       path: '/profile/basic',
  //       name: 'basic',
  //     },
  //     {
  //       path: '/profile/basic/:id',
  //       hideInMenu: true,
  //     },
  //     {
  //       path: '/profile/advanced',
  //       name: 'advanced',
  //       authority: ['admin'],
  //     },
  //   ],
  // },
  // // 图表
  // {
  //   path: '/charts',
  //   name: 'charts', // 生成菜单项的文本
  //   icon: 'area-chart', // 生成菜单项的图标
  //   routes: [
  //     {
  //       path: '/charts/orgtree',
  //       name: 'orgtree',
  //     },
  //   ],
  // },
  // // 自定义
  // {
  //   path: '/DIYcompoment',
  //   name: 'DIY',
  //   icon: 'appstore',
  //   routes: [
  //     {
  //       path: '/DIYcompoment/table',
  //       name: 'divtable',
  //     },
  //     {
  //       path: '/DIYcompoment/commoncomponent',
  //       name: 'commoncomponent',
  //     },
  //     {
  //       path: '/DIYcompoment/map',
  //       name: 'map',
  //     },
  //   ],
  // },
  // {
  //   name: 'result',
  //   icon: 'check-circle-o',
  //   path: '/result',
  //   routes: [
  //     // result
  //     {
  //       path: '/result/success',
  //       name: 'success',
  //       component: './Result/Success',
  //     },
  //     { path: '/result/fail', name: 'fail', component: './Result/Error' },
  //   ],
  // },
  // {
  //   name: 'exception',
  //   icon: 'warning',
  //   path: '/exception',
  //   routes: [
  //     // exception
  //     {
  //       path: '/exception/403',
  //       name: 'not-permission',
  //     },
  //     {
  //       path: '/exception/404',
  //       name: 'not-find',
  //     },
  //     {
  //       path: '/exception/500',
  //       name: 'server-error',
  //     },
  //     {
  //       path: '/exception/trigger',
  //       name: 'trigger',
  //       hideInMenu: true,
  //     },
  //   ],
  // },
  // {
  //   name: 'account',
  //   icon: 'user',
  //   path: '/account',
  //   routes: [
  //     {
  //       path: '/account/center',
  //       name: 'center',
  //       component: './Account/Center/Center',
  //       routes: [
  //         {
  //           path: '/account/center',
  //           redirect: '/account/center/articles',
  //         },
  //         {
  //           path: '/account/center/articles',
  //           component: './Account/Center/Articles',
  //         },
  //         {
  //           path: '/account/center/applications',
  //           component: './Account/Center/Applications',
  //         },
  //         {
  //           path: '/account/center/projects',
  //           component: './Account/Center/Projects',
  //         },
  //       ],
  //     },
  //     {
  //       path: '/account/settings',
  //       name: 'settings',
  //       component: './Account/Settings/Info',
  //       routes: [
  //         {
  //           path: '/account/settings',
  //           redirect: '/account/settings/base',
  //         },
  //         {
  //           path: '/account/settings/base',
  //           component: './Account/Settings/BaseView',
  //         },
  //         {
  //           path: '/account/settings/security',
  //           component: './Account/Settings/SecurityView',
  //         },
  //         {
  //           path: '/account/settings/binding',
  //           component: './Account/Settings/BindingView',
  //         },
  //         {
  //           path: '/account/settings/notification',
  //           component: './Account/Settings/NotificationView',
  //         },
  //       ],
  //     },
  //   ],
  // },
  // //  editor
  // {
  //   name: 'editor',
  //   icon: 'highlight',
  //   path: '/editor',
  //   routes: [
  //     {
  //       path: '/editor/flow',
  //       name: 'flow',
  //     },
  //     {
  //       path: '/editor/mind',
  //       name: 'mind',
  //     },
  //     {
  //       path: '/editor/koni',
  //       name: 'koni',
  //     },
  //   ],
  // },
  // ],
  // },
];

export function getMenuData() {
  return menuData;
}

export default {
  'GET /api/getMenuData': getMenuData(),
};
