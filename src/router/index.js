import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

function importComponent(path) {
  return () => import(`../components/${path}.vue`)
}
const router = new VueRouter(
  {mode: "history",
  routes:[{
    path: '/',
    name: 'Home',
    meta: {title: 'Atma Korean BBQ'},
    component: importComponent('home'),
    children:[
      {
        path:'/home',
        name:'Home Options',
        meta:{
          title: 'Atma Korean BBQ',
          permissions:[
            {
              role: 'unauthenticated',
              access: false,
              redirect:"Login"
            }
          ]
        },
        component:importComponent('home_options'),
      },
      {
        path:'/customer',
        name:'Customers',
        meta: {title: 'Customers',
       },
        component:importComponent('options/customer')
      },
      {
        path:'/reservation',
        name:'Reservation',
        meta: {title: 'Reservation',
        
        },
        component:importComponent('options/reservation')
      },
      {
        path:'/reservation-detil',
        name:'Reservation Detil',
        meta: {title: 'Reservation Detil',
        
        },
        component:importComponent('options/reservation-detil')
      },
      {
        path: '/login',
        name: 'Login',
        meta: {title: 'Login'},
        component: importComponent('login')
      },
      {
        path: '/profile',
        name: 'Profile',
        meta: {title: 'Profile'},
        component: importComponent('profile')
      },
      {
        path:'/menu-display',
        name:'Display Menu',
        meta: {title: 'Display Menu',
       },
        component:importComponent('options/menu-display')
      },
    ]
  },
  
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: importComponent('dashboard/dashboard'),
    children:[
      {
        path: '/jabatan',
        name: 'Data Jabatan',
        meta:{
          title:'Jabatan',
        },
        component: importComponent('dashboard/jabatan')
      },
      {
        path: '/Data-reservasi',
        name: 'Data Reservasi',
        meta:{
          title:'Data Reservasi',
        },
        component: importComponent('dashboard/data-reservasi')
      },
      {
        path: '/karyawan',
        name: 'Data Karyawan',
        meta: {title:"Data Karyawan"},
        component: importComponent('dashboard/karyawan')
      },{
        path: '/menu',
        name: 'Data Menu',
        meta: {title:"Data Menu"},
        component: importComponent('dashboard/menu')
      },
      {
        path: '/meja',
        name: 'Data Meja',
        meta: {title:"Data Meja"},
        component: importComponent('dashboard/meja')
      },
      {
        path: '/bahan',
        name: 'Data Bahan',
        meta: {title:"Data Bahan"},
        component: importComponent('dashboard/bahan')
      },
      {
        path: '/history',
        name: 'History',
        meta: {title:"Data Keluar & Masuk Bahan"},
        component: importComponent('dashboard/history')
      },
    ]
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
],
});

router.beforeEach((to, from, next)=>{
  if(to.name!="Login" && localStorage.getItem("isLogedin")!=1){
      next('Login')
  }else if(to.name=="Login" && localStorage.getItem("isLogedin")==1 ){
      next('Home')
  }
  document.title = to.meta.title;
  next();
});


export default router
