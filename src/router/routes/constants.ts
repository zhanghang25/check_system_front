import { LAYOUT } from '@/store/keys'

export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      hidden: true,
    },
  },
  {
    path: '/outList',
    name: 'OutList',
    component: () => import('@/views/login/outList.vue'),
    meta: {
      hidden: true,
    },
  },
  {
    path: '/redirect',
    component: LAYOUT,
    meta: {
      hidden: true,
      noShowTabbar: true,
    },
    children: [
      {
        path: '/redirect/:path(.*)*',
        component: () => import('@/views/redirect/index.vue'),
      },
    ],
  },
  {
    path: '/personal',
    name: 'personal',
    component: LAYOUT,
    meta: {
      title: '个人中心',
      hidden: true,
    },
    children: [
      {
        path: 'info',
        component: () => import('@/views/personal/index.vue'),
        meta: {
          title: '个人中心',
        },
      },
    ],
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/exception/404.vue'),
    meta: {
      hidden: true,
    },
  },
  {
    path: '/500',
    name: '500',
    component: () => import('@/views/exception/500.vue'),
    meta: {
      hidden: true,
    },
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/exception/403.vue'),
    meta: {
      hidden: true,
    },
  },
]
export const duanShangRoutes = [
  {
    menuUrl: '/index3',
    menuName: '审核信息',
    routeName: 'checkList',
    iconPrefix: 'iconfont',
    icon: 'detail',
    parentPath: '',
    children: [
      {
        parentPath: '/index3',
        menuUrl: '/index3/duanShangList',
        menuName: '审核列表',
        routeName: 'detailReg',
        localFilePath: '/duanShang/list',
      },
    ],
  },
]
export const cheJianRoutes = [
  {
    menuUrl: '/index4',
    menuName: '提报信息',
    routeName: 'submitList',
    iconPrefix: 'iconfont',
    icon: 'detail',
    parentPath: '',
    children: [
      {
        parentPath: '/index4',
        menuUrl: '/index4/cheJianList',
        menuName: '提报列表',
        routeName: 'detailReg',
        localFilePath: '/cheJian/list',
      },
    ],
  },
]
export const adminRoutesMy = [
  {
    menuUrl: '/index2',
    menuName: '用户',
    routeName: 'register',
    iconPrefix: 'iconfont',
    icon: 'detail',
    parentPath: '',
    children: [
      {
        parentPath: '/index2',
        menuUrl: '/index2/register',
        menuName: '注册用户',
        routeName: 'detailReg',
        localFilePath: '/admin/register',
      },
      {
        parentPath: '/index2',
        menuUrl: '/index2/userList',
        menuName: '用户列表',
        routeName: 'userList',
      },
    ],
  },
]
