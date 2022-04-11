<template>
  <div id="navbar">
    <div id="brand">
      <span class="title-zh">云图二维</span>
      <span class="title-en">CLOUDCAD</span>
    </div>


    <div id="log-reg" class="nav-right" v-if="!isLogin">
      <div class="btn-log" @click="toLog">登录</div>
      <div class="btn-reg" @click="toReg">注册</div>
    </div>
    <div id="info" class="nav-right" v-else>
      <img
        class="btn-my"
        :src="avatar ? avatar : require('../../assets/img/logo.png')"
        alt="我的"
        @mouseenter="enter"
        @mouseleave="leave"
      />
    </div>
    <div v-show="isshow" id="my-menu" @mouseenter="show" @mouseleave="leave">
      <div @click="toUserInfo">
        <span class="iconfont icon-xinxibar_zhanghu"></span
        ><span>个人中心</span>
      </div>
      <hr />
      <div @click="logOut">
        <span class="iconfont icon-switch"></span>
        <span>退出登录</span>
      </div>
    </div>
  </div>
</template>
<script>
import {getUserInfo} from "../../request/api";
export default {
  data() {
    return {
      isshow: false,
      timer: null,
      title:"",
      avatar:null
    };
  },
  mounted() {
    this.getUserAvatar();
  },
  computed: {
    isLogin(){
      if(sessionStorage.getItem('userName') && sessionStorage.getItem('userToken')){
        this.$store.commit('userStatus',sessionStorage.getItem('userName'));
      }else{
        this.$store.commit('userStatus',null);
      }
      return this.$store.getters.isLogin;
    }
  },
  methods: {
    toLog() {
      this.$router.push("/login");
    },
    toReg() {
      this.$router.push("/register");
    },
    enter() {
      this.isshow = true;
    },
    leave() {
      this.timer = setTimeout(() => {
        this.isshow = false;
      }, 1000);
    },
    show() {
      clearTimeout(this.timer);
    },
    toUserInfo(){
      this.$router.push("/user");
    },
    logOut(){
      this.$router.push({path:'/login'});
    },
    getUserAvatar(){
      let _name = sessionStorage.getItem("userName")
      if(_name && _name != 'null'){
        getUserInfo(_name).then((res)=>{
          this.avatar = res.data[0].avatar;
        })
      }else{
        this.avatar = require("../../assets/img/logo.png");
      }
    }
  },
};
</script>
<style lang="scss" scoped>
$nav-color: #1f8dee;
$nav-box-magrin: 0 60px;
#navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 8vh;
  box-shadow: #ededed 0px 4px 4px;
}
#brand {
  margin: $nav-box-magrin;
  padding: 15px 0;
  display: flex;
  flex-direction: column;
}
.title-zh {
  font-size: 22px;
  letter-spacing: 4px;
  color: $nav-color;
}
.title-en {
  font-size: 10px;
  letter-spacing: 5px;
  color: $nav-color;
}
.nav-right {
  display: flex;
  justify-content: space-between;
  height: 8vh;
  line-height: 8vh;
  margin: $nav-box-magrin;
  color: $nav-color;
}
.btn-log,
.btn-reg {
  padding: 0 20px;
  letter-spacing: 10px;
  text-indent: 10px;
  text-align: center;
  cursor: pointer;
}
.btn-log:hover,
.btn-reg:hover {
  background-color: $nav-color;
  color: #fff;
}
.btn-my {
  width: 40px;
  height: 40px;
  margin-top: 40px;
  transform: translateY(-50%);
  border-radius: 50%;
  border: 1px #ccc solid;
  cursor: pointer;
}
#my-menu {
  position: absolute;
  z-index: 10;
  padding: 0px 20px;
  top: 80px;
  right: 60px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: #ededed 5px 5px 10px 10px;
}
#my-menu div {
  cursor: pointer;
  display: flex;
  height: 20px;
  margin: 10px 0;
  padding: 10px 20px;
  font-size: 12px;
  border-radius: 10px;
  align-items: center;
}
#my-menu div:hover {
  background-color: #ecf5ff;
}
.icon-xinxibar_zhanghu {
  color: black;
  font-size: 36px;
  margin-right: 10px;
}
.icon-switch {
  color: red;
  font-size: 36px;
  margin-right: 10px;
}
</style>
