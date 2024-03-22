import { createRouter, createWebHistory } from 'vue-router'

/**
 * Dans le router
 * Je définie quel composant Vue correspond à quelle route
 */

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/Accueil.vue')
    },
    {
      path: '/films',
      component: () => import('@/views/Films.vue')
    },
    {
      path: '/genres',
      component: () => import('@/views/Genres.vue')
    },
    {
      path: '/participants',
      component: () => import('@/views/Participants.vue')
    },
    {
      path: '/membres',
      component: () => import('@/views/Membres.vue')
    },
    // on charge le même template sur la vue de création et d'affichage
    {
      path: '/films/creer',
      component: () => import('@/views/FilmCreation.vue')
    },
    /*
     routes avec un paramètre variable :id
     on pourra recupérer l'id dans le composant avec :
     import { useRoute } from 'vue-router'
     const id = useRoute().params.id
    */

    {
      path: '/films/:id',
      component: () => import('@/views/FilmDetail.vue')
    },
    {
      path: '/films/:id/edit',
      component: () => import('@/views/FilmEdit.vue')
    },
    {
      path: '/films/:id/delete',
      props: true,
      component: () => import('@/views/Confirmation.vue')
    },
    {
      path: '/films/:id/avis',
      component: () => import('@/views/Avis.vue')
    },
    /*
    Page de Login
    */
    {
      path: '/login',
      component: () => import('@/views/Login.vue')
    }
  ]
})

export default router
