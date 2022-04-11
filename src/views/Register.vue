<template>
  <div class="register">
    <span class="iconfont icon-leftbutton-fill" @click="toHome"></span>
    <div class="form">
      <div class="form-left"></div>
      <div class="form-right">
        <form action="">
          <div>
            <span class="msg">{{this.regMsg}}</span>
          </div>
          <div>
            <label for="account">账号</label>
            <input
              id="account"
              type="text"
              placeholder="请输入账号"
              v-model="form.username"
              autocomplete="off"
              @blur="checkuser()"
            />
          </div>
          <div>
            <label for="password">密码</label>
            <input
              id="password"
              type="password"
              placeholder="请输入密码"
              v-model="form.password"
              @blur="checkpwd()"
            />
          </div>
          <div>
            <label for="password_again">确认密码</label>
            <input
              id="password_again"
              type="password"
              placeholder="请再次输入密码"
              v-model="form.password_again"
              @blur="checkrepwd()"
            />
          </div>
          <div>
            <input id="btn-reg" type="button" value="注册" @click="submitInfo($event)"/>
            <input id="btn-log" type="button" value="登录" @click="toLog()" />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import {sumbit,vailteAccount} from "@/request/api";
const uuidV1 = require('uuid/v1');
export default {
  data() {
    return {
      form: {
        username: "",
        password: "",
        password_again: "",
      },
      regMsg:'',
    };
  },
  methods: {
    toHome() {
      this.$router.push("/");
    },
    toLog() {
      this.$router.push("/login");
    },
    // 验证用户名规则 验证用户名唯一性
    checkuser(){
      let _name = this.form.username;
      let reg = /^[a-zA-Z][a-zA-Z0-9]{3,15}$/; // 用户名由4-16位字符组成，不能包含数字

      if (reg.test(_name) == false) {
        this.regMsg="用户名不合法"
        this.form.username = '';
        return false;
      }else{
        this.regMsg=""
        vailteAccount(_name).then((res)=>{
          if(res.isExit == true){
            this.regMsg="用户名已存在"
            return false
          }
        })
        this.regMsg=""
        return true;
      }
    },
    // 验证密码
    checkpwd() {
      let pwd = this.form.password;
      let reg = /^[A-Za-z0-9]{4,10}$/; // 密码由4-10位字符组成
      if (reg.test(pwd) == false) {
        this.regMsg="密码不合法"
        this.form.password = '';
        return false;
      }
      this.regMsg=""
      return true;
    },
    //验证确认密码
    checkrepwd() {
      let pwd = this.form.password;
      let _pwd = this.form.password_again;
      if (_pwd != pwd) {
        this.regMsg="两次密码不一致"
        this.form.password_again = '';
        return false;
      }
      this.regMsg=""
      return true;
    },
    submitInfo(e){
      e.preventDefault();
      let valitdate = this.checkuser() && this.checkpwd() && this.checkrepwd();
      let isNotNull = this.form.username && this.form.password && this.form.password_again;
      if(valitdate && isNotNull){
        let uid = uuidV1();
        let param = {uid,...this.form};
        sumbit(param).then((res)=>{
          this.regMsg="注册成功";
          if(res.isoperate){
            this.$router.push("/login");
          }else{
            this.regMsg="注册失败，服务器异常";
          }
        })
      }else {
        this.regMsg="注册信息不合法"
        return false;
      }
    },
  },
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
.register {
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
.form-left,
.form-right {
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
  display: flex;
  justify-content: space-between;
}
.form-right label {
  color: $log-color;
  font-size: 16px;
  margin-right: 40px;
}
#account,
#password,
#password_again {
  border: 1px $log-color solid;
  border-radius: 5px;
  outline: none;
  height: 24px;
}
.form-right div:last-child {
  display: flex;
  flex-direction: column;
}
#btn-reg {
  outline: none;
  height: 40px;
  margin-bottom: 10px;
  border: 1px solid $log-color;
  color: $log-color;
  background: #fff;
  cursor: pointer;
}
#btn-log {
  outline: none;
  height: 20px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #ccc;
}
#btn-reg:hover {
  background: $log-color;
  color: #fff;
}
#btn-log:hover {
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
