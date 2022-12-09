import { createRouter, createWebHistory } from 'vue-router'
import SidebarRight from '@/components/SidebarRight.vue'
import TheNavigation from '@/components/TheNavigation.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      components: {
        default: () => import('@/views/HomeView.vue'),
        //rightSide: SidebarRight,
        //navigation: TheNavigation,
      }
    },
    {
      path: '/login',
      name: 'login',
      components: {
        default: () => import('@/views/Login.vue'),
        //rightSide: SidebarRight,
        //navigation: TheNavigation,
      }
    },
    {
      path: '/articles',
      name: 'articles',
      components: {
        default: () => import('../views/Articles.vue'),
        rightSide: SidebarRight,
        navigation: TheNavigation,
      }
    },
    {
      path: '/articles/:id',
      name: 'articleDetail',
      components: {
        default:() => import('../views/ArticleDetail.vue'),
        rightSide: SidebarRight,
        navigation: TheNavigation,
      },
    },
    {
      path: '/articles/:id/edit',
      name: 'editArticle',
      components: {
        default:() => import('../views/ArticleEditor.vue'),
        navigation: TheNavigation,
        //rightSide: SidebarRight,
      },
    },
    {
      path: '/articles/create',
      name: 'createArticle',
      components: {
        default:() => import('../views/ArticleEditor.vue'),
        navigation: TheNavigation,
        //rightSide: SidebarRight,
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      components: {
        default: () => import('@/views/NotFound.vue'),
        //rightSide: SidebarRight,
        //navigation: TheNavigation,
      },
    },
  ]
})

router.afterEach((to, from) => {
  if (to.path != '/' && to.path != '/login') {
    let classes = document.querySelector('body')?.classList
    classes?.remove('fixed')
    classes?.remove('not-found')
  }
})

export default router
