export default [
    { path: '/dashboard', component: require('./components/Dashboard.vue').default },
    { path: '/superuser', component: require('./components/superuser.vue').default },
    { path: '/todo', component: require('./components/Todo/Todo.vue').default },
    { path: '/developer', component: require('./components/Developer.vue').default },
    { path: '/users', component: require('./components/Users.vue').default },
    { path: '/products', component: require('./components/product/Products.vue').default },
    { path: '/product/tag', component: require('./components/product/Tag.vue').default },
    { path: '/product/category', component: require('./components/product/Category.vue').default },
    { path: '*', component: require('./components/NotFound.vue').default }
];
