<template>
  <div class="login">
    <span class="iconfont icon-leftbutton-fill" @click="toHome"></span>
    <div class="form">
      <div class="form-left"></div>
      <div class="form-right">
        <form action="">
          <div class="msg">
            <span >{{this.logMsg}}</span>
          </div>
          <div>
            <label for="account">账号</label>
            <input
              id="account"
              type="text"
              placeholder="请输入账号"
              v-model="form.account"
              autocomplete="off"
              @blur="clearMsg"
            />
          </div>
          <div>
            <label for="password">密码</label>
            <input
              id="password"
              type="password"
              placeholder="请输入密码"
              v-model="form.password"
              autocomplete="off"
              @blur="clearMsg"
            />
          </div>
          <div>
            <input id="btn-log" type="button" value="登录" @click="login($event)"/>
            <input id="btn-reg" type="button" value="注册" @click="toReg" />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import {loginVailte} from "@/request/api";
export default {
  data() {
    return {
      form: {
        account: "",
        password: "",
      },
      logMsg:''
    };
  },
  methods: {
    toHome() {
      this.$router.push("/");
    },
    toReg(){
      this.$router.push("/register");
    },
    clearMsg(){
      this.logMsg ='';
    },
    login(e){
      e.preventDefault();
      let {account,password} = this.form;
      if(account && password) {
        loginVailte(account,password).then((res)=>{
          console.log(res)
          if(res.code == '1'){
            this.logMsg = res.msg;

            // 将用户名和token存入sessionStorage
            sessionStorage.setItem('userName',account)
            sessionStorage.setItem('userToken','test')
            // 将用户名存入vuex
            this.$store.dispatch('setUser',account)
            // 登录成功跳转到首页
            this.$router.push({path: '/'});
          }else{
            this.logMsg = res.msg;
          }
        })
      }
    }
  },
  beforeRouteEnter:(to,from,next) =>{
    next(vm => {
      vm.$store.dispatch("setUser",null);
    })
  }
};
</script>
<style lang="scss" scoped>
$log-color: #1f8dee;
.msg{
  width: 100%;
  color: red;
  text-align: center;
  font-size: 14px;
}
.login {
  width: 100%;
  display: flex;
  justify-content: center;
  background-image: url(../assets/img/login-bc1.jpg);
  background-size: cover;
  background-position: center;
}
.form {
  width: 800px;
  height: 600px;
  display: flex;
  margin-top: 19%;
  transform: translateY(-40%);
  border-radius: 5%;
  overflow: hidden;
  box-shadow: 0px 5px 10px 3px #4d4c4c;
}
.form-left {
  width: 400px;
  height: 600px;
}
.form-left {
  background-image: url(../assets/img/login-bc2.jpg);
  background-size: contain;
}
.form-right {
  display: flex;
  justify-content: left;
  align-items: center;
  width: 350px;
  height: 600px;
  padding: 0 10px 0px 40px;
  background-color: #fff;
}
.form-right div {
  margin-bottom: 20px;
}
.form-right label {
  color: $log-color;
  font-size: 20px;
  margin-right: 20px;
}
#account,
#password {
  border: 1px $log-color solid;
  border-radius: 5px;
  outline: none;
  height: 24px;
}
.form-right div:last-child {
  display: flex;
  flex-direction: column;
}
#btn-log {
  outline: none;
  height: 40px;
  margin-bottom: 10px;
  border: 1px solid $log-color;
  color: $log-color;
  background: #fff;
  cursor: pointer;
}
#btn-reg {
  outline: none;
  height: 20px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #ccc;
}
#btn-log:hover {
  background: $log-color;
  color: #fff;
}
#btn-reg:hover {
  color: #000;
}
.icon-leftbutton-fill {
  position: absolute;
  top: 2%;
  left: 2%;
  font-size: 48px;
  cursor: pointer;
  color: #ccc;
}
.icon-leftbutton-fill:hover {
  color: #000;
}
</style>
