import Vue from 'vue'
import Router from 'vue-router'
import record from '@/components/record'
import login from '@/components/login'
import oilrecord from '@/components/oilrecord'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/record',
      name: 'record',
      component: record
    },
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/oilrecord',
      name: 'oilrecord',
      component: oilrecord
    }

  ]
})
