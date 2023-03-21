import {createRouter, createWebHashHistory} from 'vue-router'
import login from "@/views/login";
import register from "@/views/register";
import layout from "@/views/layout";
import findPassword from "@/views/findPassword";



// 1. 定义路由组件.
// 也可以从其他文件导入
// const Home = { template: '<div>Home</div>' }


// 2. 定义一些路由
// 每个路由都需要映射到一个组件。
// 我们后面再讨论嵌套路由。
const routes = [
  {
    path: '/',
    name: 'index',
    redirect: '/login',
  },
  { path: '/login',
    name:login,
    component: () => import('@/views/login/index.vue')
  },
  { path: '/findPassword',
    name:findPassword,
    component: () => import('@/views/findPassword/index.vue')
  },
  { path: '/register',
    name: register,
    component: () => import('@/views/register/index.vue') },

  {
    path: '/admin',
    name:'admin',
    component:layout,
    redirect:'/admin/bookManage',
    children: [
      {
        path:'/admin/bookManage',
        name:'bookManage',
        component:()=>import('@/views/admin/bookManage/index'),
      },
      {
        path:'/admin/readerManage',
        name:'readerManage',
        component:()=>import('@/views/admin/readerManage/index'),
      },
      {
        path:'/admin/brManage',
        name:'brManage',
        component:()=>import('@/views/admin/brManage/index'),
      },
      {
        path:'/admin/comments',
        name:'comments',
        component:()=>import('@/views/admin/comments/index'),
      },
      {
        path:'/admin/adviceInfo',
        name:'adviceInfo',
        component:()=>import('@/views/admin/adviceInfo/index'),
      },
      {
        path:'/admin/noticeManage',
        name:'noticeManage',
        component:()=>import('@/views/admin/noticeManage/index'),
      },
    ]
  },
  {
    path: '/reader',
    name:'reader',
    component:layout,
    redirect:'/reader/readerIndex',
    children: [
      {
        path:'/reader/bookQuery',
        name:'bookQuery',
        component:()=>import('@/views/reader/bookQuery/index'),
      },
      {
        path:'/reader/personal',
        name:'personal',
        component:()=>import('@/views/reader/personal/index'),
      },
      {
        path:'/reader/myBR',
        name:'myBR',
        component:()=>import('@/views/reader/myBR/index'),
      },
      {
        path:'/reader/fixPassword',
        name:'fixPassword',
        component:()=>import('@/views/reader/fixPassword/index'),
      },
      {
        path: '/reader/:bookId',
        name: 'bookDetail',
        component:()=>import('@/views/reader/bookDetail/index')

      },
      {
        path: '/reader/advice',
        name: 'advice',
        component:()=>import('@/views/reader/advice/index')
      },
      {
        path: '/reader/myMessage',
        name: 'myMessage',
        component:()=>import('@/views/reader/myMessage/index')
      },
      {
        path: '/reader/readerIndex',
        name: 'readerIndex',
        component:()=>import('@/views/reader/readerIndex/index')
      }
    ]
  }
  // {
  //   path:'/',
  //   name:layout,
  //   component: ()=>import('@/views/layout'),
  //   children:[
  //     {
  //       path: '/',
  //       redirect: 'login',
  //       component: () => import('@/views/login/index.vue')
  //     },
  //     {
  //       path:'admin/bookManage',
  //       name:'bookManage',
  //       component:()=>import('@/views/admin/bookManage/index'),
  //     },
  //     {
  //       path:'admin/readerManage',
  //       name:'readerManage',
  //       component:()=>import('@/views/admin/readerManage/index'),
  //     },
  //     {
  //       path:'admin/brManage',
  //       name:'brManage',
  //       component:()=>import('@/views/admin/brManage/index'),
  //     },
  //     {
  //       path:'admin/comments',
  //       name:'comments',
  //       component:()=>import('@/views/admin/comments/index'),
  //     },
  //   ]
  // }
]

// 3. 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里
// 暂时保持简单
export default createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHashHistory(),
  routes, // `routes: routes` 的缩写
});