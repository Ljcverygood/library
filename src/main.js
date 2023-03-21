// main.ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'

import 'element-plus/dist/index.css'
import App from './App.vue'
import router from "@/router";



const app = createApp(App)

app.use(ElementPlus)
app.use(router)
//路由守卫
router.beforeEach((to,from,next)=>{
    let token=localStorage.getItem("token")||"";
    if(token){
        next();
    }else {
        if(to.path=="/login"||to.path=="/register"||to.path=="/findPassword"){
            next();
        }else {
            next({path:"/login"})

        }
    }
})


app.mount('#app')