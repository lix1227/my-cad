import Vue from "vue";
import VueRouter from "vue-router";
import Index from "../views/Index";
import Login from "../views/Login";
import Register from "../views/Register";
import WorkSpace from "../views/WorkSpace/Index";
import MyProject from "../views/WorkSpace/MyProject/MyProject";
import Recycle from "../views/WorkSpace/Recycle/Recycle";
import Course from "../views/WorkSpace/Course/Course";
import Problem from "../views/WorkSpace/Problem/Problem";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "index",
    component: Index,
    redirect: "/workspace",
    children: [
      {
        path: "workspace",
        name: "workspace",
        component: WorkSpace,
        redirect: "/workspace/myproject",
        children: [
          {
            path: "myproject",
            name: "myproject",
            component: MyProject,
            meta: {
              title: "我的项目",
              icon: "iconfont icon-folder-fill",
              islist: 1,
              position: "top",
              defaultActive:true
            },
          },
          {
            path: "recycle",
            name: "recycle",
            component: Recycle,
            meta: {
              title: "回收站",
              icon: "iconfont icon-ashbin",
              islist: 1,
              position: "bottom",
              defaultActive:false
            },
          },
          {
            path: "course",
            name: "course",
            component: Course,
            meta: {
              title: "新手教程",
              icon: "iconfont icon-training1",
              islist: 0,
            },
          },
          {
            path: "problem",
            name: "problem",
            component: Problem,
            meta: {
              title: "问题反馈",
              icon: "iconfont icon-survey",
              islist: 0,
            },
          },
        ],
      },
      {
        path: "user",
        name: "user",
        component:()=>import("../views/Account/Index"),
        meta: {
          title: "个人信息"
        }
      },
      {
        path: 'paint',
        name: 'paint',
        component: ()=>import("../views/Paint/Index"),
        meta: {
          title: "绘制区域"
        }
      }
    ],
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/register",
    name: "register",
    component: Register,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
