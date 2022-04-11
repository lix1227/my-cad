<template>
  <div id="user_info">
      <div id="photo" class="ani-box">
        <div class="box-top" @click.self="changeShow($event)">
          <span class="box-top-one">头像</span>
          <img v-show="!isshow_one" class="box-top-two user_img" :src="user_info.avatar ? user_info.avatar : require('../../assets/img/logo.png')">
          <div class="box-top-three box-btn">
            <template v-if="!isshow_one">
              <span class="iconfont icon-editor"></span>
              <span>编辑</span>
            </template>
            <template v-else>
              <span class="iconfont icon-double-arro-right"></span>
              <span>收起</span>
            </template>
          </div>
        </div>
        <transition
          v-on:before-enter="displayNone"
          v-on:after-enter="displayBlock"
          v-on:before-leave="displayNone"
          name="pull-box"
        >
          <div v-show="isshow_one" class="box-bottom bottom-one">
            <div class="img_uploader">
              <img class="new_img" v-show="hasImg" :src="new_avatar">
              <label for="input_img" v-show="!hasImg" class="iconfont icon-add-select"></label>
              <input
                id="input_img"
                style="display: none"
                ref="input_img"
                type="file"
                accept="image/gif, image/jpeg, image/jpg, image/png, image/svg"
                @change="handleFileChange"
              >
            </div>
            <div class="img_btn" v-show="hasImg && isshow_one">
              <span @click="saveAvatar($event)">提交</span>
              <span @click="deleteAvatar($event)">删除</span>
            </div>
          </div>
        </transition>
      </div>

      <div id="user_name" class="ani-box">
        <div class="box-top" @click.self="changeShow($event)">
          <span class="box-top-one">用户名</span>
          <span v-if="!isshow_two" class="box-top-two user_name">{{user_info.username}}</span>
          <div class="box-top-three box-btn">
            <template v-if="!isshow_two">
              <span class="iconfont icon-editor"></span>
              <span>编辑</span>
            </template>
            <template v-else>
              <span class="iconfont icon-double-arro-right"></span>
              <span>收起</span>
            </template>
          </div>
        </div>
        <transition
          v-on:before-enter="displayNone"
          v-on:after-enter="displayBlock"
          v-on:before-leave="displayNone"
          name="pull-box"
        >
          <div class="box-bottom bottom-two" v-if="isshow_two">
            <form>
              <label class="form_item_label" for="name">用户名</label>
              <input class="form_item_input" id="name" ref="getUsername" :value="user_info.username" type="text" placeholder="请输入新的用户名" />
              <br><button class="form_item_btn" @click="saveName($event)">保存</button>
            </form>
          </div>
        </transition>
      </div>

      <div id="password" class="ani-box">
        <div class="box-top" @click.self="changeShow($event)">
          <span class="box-top-one">密码</span>
          <span v-if="!isshow_three" class="box-top-two user_psd">{{user_info.password ? "********" : null}}</span>
          <div class="box-top-three box-btn">
            <template v-if="!isshow_three">
              <span class="iconfont icon-editor"></span>
              <span>编辑</span>
            </template>
            <template v-else>
              <span class="iconfont icon-double-arro-right"></span>
              <span>收起</span>
            </template>
          </div>
        </div>
        <transition
        v-on:before-enter="displayNone"
        v-on:after-enter="displayBlock"
        v-on:before-leave="displayNone"
        name="pull-box"
        >
          <div class="box-bottom bottom-three" v-if="isshow_three">
            <form>
              <div>
                <label class="form_item_label" for="old_psd">旧密码</label>
                <input class="form_item_input" id="old_psd" ref="getOldPsd" type="password" />
              </div>
              <br>
              <div>
                <label class="form_item_label" for="new_psd">新密码</label>
                <input class="form_item_input" id="new_psd" ref="getNewPsd" type="password"  />
              </div>
              <div>
                <button class="form_item_btn" @click="savePsd($event)">保存</button>
              </div>
            </form>
          </div>
        </transition>
      </div>

      <div id="email" class="ani-box">
        <div class="box-top" @click.self="changeShow($event)">
          <span class="box-top-one">邮箱</span>
          <span v-if="!isshow_four" class="box-top-two email">{{user_info.uemail ? user_info.uemail : '无设置'}}</span>
          <div class="box-top-three box-btn">
            <template v-if="!isshow_four">
              <span class="iconfont icon-editor"></span>
              <span>编辑</span>
            </template>
            <template v-else>
              <span class="iconfont icon-double-arro-right"></span>
              <span>收起</span>
            </template>
          </div>
        </div>
        <transition
          v-on:before-enter="displayNone"
          v-on:after-enter="displayBlock"
          v-on:before-leave="displayNone"
          name="pull-box"
        >
          <div class="box-bottom bottom-four" v-if="isshow_four">
            <form>
              <label class="form_item_label" for="_email">邮箱</label>
              <input class="form_item_input" id="_email" ref="getUserEmail" :value="user_info.uemail" type="email" placeholder="请输入新的邮箱" />
              <br><button class="form_item_btn" @click="saveEmail($event)">保存</button>
            </form>
          </div>
        </transition>
      </div>

      <div id="phone" class="ani-box">
        <div class="box-top" @click.self="changeShow($event)">
          <span class="box-top-one">手机号</span>
          <span v-if="!isshow_five" class="box-top-two phone">{{user_info.uphone ? user_info.uphone : "无设置"}}</span>
          <div class="box-top-three box-btn">
            <template v-if="!isshow_five">
              <span class="iconfont icon-editor"></span>
              <span>编辑</span>
            </template>
            <template v-else>
              <span class="iconfont icon-double-arro-right"></span>
              <span>收起</span>
            </template>
          </div>
        </div>
        <transition
          v-on:before-enter="displayNone"
          v-on:after-enter="displayBlock"
          v-on:before-leave="displayNone"
          name="pull-box"
        >
          <div class="box-bottom bottom-five" v-if="isshow_five">
            <div>
              <label class="form_item_label" for="_phone">手机号</label>
              <input class="form_item_input" id="_phone" ref="getUserPhone" :value="user_info.uphone" type="phone" placeholder="请输入新的手机号" />
              <br><button class="form_item_btn" @click="savePhone($event)">保存</button>
            </div>
          </div>
        </transition>
      </div>
  </div>
</template>

<script>
import { getUserInfo, updateInfo, vailteAccount } from "@/request/api";

export default {
  inject: ['reload'],
  components: {},
  data() {
    return {
      user_info:{},
      isshow_one:false,
      isshow_two:false,
      isshow_three:false,
      isshow_four:false,
      isshow_five:false,
      hasImg:false,
      new_avatar:null
    }
  },
  mounted(){
    this._getUserInfo()
  },
  methods: {
    // 信息小组件切换
    changeShow(e){
      let objData = e.target.parentNode.parentNode.children;
      let targetIndex = this.tabIndex(e.target.parentNode, objData); //调用tabIndex方法，返回值便是元素下标
      switch (targetIndex) {
        case 0:
          this.isshow_one = !this.isshow_one;
          this.isshow_two = this.isshow_three = this.isshow_four = this.isshow_five = false;
          break;
        case 1:
          this.isshow_two = !this.isshow_two;
          this.isshow_one = this.isshow_three = this.isshow_four = this.isshow_five = false;
          break;
        case 2:
          this.isshow_three = !this.isshow_three;
          this.isshow_two = this.isshow_one = this.isshow_four = this.isshow_five = false;
          break;
        case 3:
          this.isshow_four = !this.isshow_four;
          this.isshow_two = this.isshow_three = this.isshow_one = this.isshow_five = false;
          break;
        case 4:
          this.isshow_five = !this.isshow_five;
          this.isshow_two = this.isshow_three = this.isshow_four = this.isshow_one = false;
          break;
        default:
          break;
      }
    },
    // 获取节点下标
    tabIndex(target,nodeList){
      for(let i=0;i<nodeList.length;i++){
        if(target===nodeList[i]){
          return i;
        }
      }
    },
    //动画子组件消失
    displayNone(el){
      let childNode = el.childNodes[0];
      childNode.style.display = 'none';
    },
    displayBlock: function (el) {
      let childNode = el.childNodes[0];
      childNode.style.display = 'block';
    },

    // 图片文件处理
    handleFileChange(){
      let inputDOM = this.$refs.input_img;
      let file= inputDOM.files[0];
      let size = Math.floor(file.size / 1024);
      if(size > 60){
        alert("头像图片大小不能大于5MB");
        return false;
      }
      this.imgPreview(file);
    },
    imgPreview (file) {
      let self = this;
      // 看支持不支持FileReader
      if (!file || !window.FileReader) return;

      if (/^image/.test(file.type)) {
        // 创建一个reader
        let reader = new FileReader();
        // 将图片将转成 base64 格式
        reader.readAsDataURL(file);
        // 读取成功后的回调
        reader.onloadend = function () {
          self.new_avatar = this.result;
          self.hasImg = true;
        }
      }
    },

    // 获取用户信息
    _getUserInfo(){
      let username = sessionStorage.getItem('userName');
      getUserInfo(username).then((res)=>{
        if(res.data && res.data[0]){
          this.user_info = res.data[0]
        }else{
          console.log("用户信息获取失败");
        }
      })
    },

    // 保存用户头像修改
    saveAvatar(e){
      e.preventDefault();
      let param = {
        username: this.user_info.username,
        infoType:'avatar',
        newInfo: this.new_avatar,
      }
      updateInfo(param).then((res)=>{
        if(res.code && res.code=='1'){
          this.reload();
        }else{
          alert("用户信息更新失败!");
        }
      })
    },
    // 删除上传的头像文件
    deleteAvatar(e){
      e.preventDefault();
      this.new_avatar = null;
      this.reload();
    },
    // 保存用户名修改
    saveName(e){
      e.preventDefault();
      let _name = this.$refs.getUsername.value;
      if(_name && _name != this.user_info.username){
        vailteAccount(_name).then(res=>{
          if(res.isExit){
            alert('用户名已注册');
            return;
          }
          let param = {
            username: this.user_info.username,
            infoType: 'username',
            newInfo: _name
          };
          updateInfo(param).then(_res=>{
            if(_res.code && _res.code == '1'){
              // 将用户名和token存入sessionStorage
              sessionStorage.setItem('userName',_name)
              sessionStorage.setItem('userToken','test')
              // 将用户名存入vuex
              this.$store.dispatch('setUser',_name)
              this.reload();
            }else{
              alert("用户信息更新失败!");
            }
          })
        })
      }
    },
    // 保存密码修改
    savePsd(e){
      e.preventDefault();
      let psd = this.$refs.getOldPsd.value;
      let _psd = this.$refs.getNewPsd.value;
      if(psd != _psd){
        alert("两次密码不一致");
        return;
      }
      let param = {
        username: this.user_info.username,
        infoType:'password',
        newInfo:psd
      }
      updateInfo(param).then(res=>{
        if(res && res.code == '1'){
          this.reload()
        }else{
          alert("用户信息更新失败!");
        }
      })
    },
    // 保存手机修改
    savePhone(e){
      e.preventDefault();
      let _phone = this.$refs.getUserPhone.value;
      let re = /^1\d{10}$/;
      if(!re.test(_phone)){
        alert("手机号不合法");
        return;
      }
      let param = {
        username:this.user_info.username,
        infoType:'uphone',
        newInfo:_phone
      }
      updateInfo(param).then(res=>{
        if(res && res.code=='1'){
          this.reload();
        }else{
          alert("用户信息更新失败");
        }
      })
    },
    // 保存邮箱修改
    saveEmail(e){
      e.preventDefault();
      let _email = this.$refs.getUserEmail.value;
      let reg = /^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/;
      if(!reg.test(_email)){
        alert("邮箱号不合法");
        return;
      }
      let param = {
        username:this.user_info.username,
        infoType:'uemail',
        newInfo:_email
      }
      updateInfo(param).then(res=>{
        if(res && res.code=='1'){
          this.reload();
        }else{
          alert("用户信息更新失败");
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#user_info{
  margin-top: 5px;
  padding-top:40px;
  background-color: #F5F6FA;
  height: 840px;
  text-align: center;
}
.ani-box{
  margin-left: 50%;
  transform: translateX(-50%);
  width: 700px;
  height: auto;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  padding: 30px 30px 10px 30px;
  font-size: 14px;
  color: #777;
}
.box-top{
  display: flex;
  height: 50px;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
}
.box-top-one{
  text-align: left;
  width: 150px;
}
.box-top-three{
  margin-left: auto;
  color: #87BBFF;
}
.box-top-three .iconfont{
  margin-right: 5px;
}
.box-bottom{
  border-top: 1px #ccc  dashed;
  display: flex;
  align-items: center;
  padding-left: 150px;
}
.bottom-one{
  height: 100px;
}
.img_uploader{
  width: 80px;
  height: 80px;
  border: 1px dashed #ccc;
  text-align: center;
  line-height: 80px;
}
.new_img{
  width: 80px;
  height: 80px;
}
.icon-add-select{
  font-size: 36px;
  cursor: pointer;
}
.user_img{
  width: 50px;
  border: 1px solid #000;
  border-radius: 50%;
}
.img_btn{
  padding-bottom: 10px;
  align-self: end;
}
.img_btn span{
  color: #ccc;
  cursor: pointer;
  margin-left: 10px;
}
.img_btn span:hover{
  color: #000;
}
.bottom-two{
  height: 100px;
}
.bottom-three{
  height: 150px;
}
.bottom-four{
  height: 100px;
}
.bottom-five{
  height: 100px;
}
.form_item_label{
  margin-right: 10px;
}
.form_item_input{
  outline: none;
  width: 240px;
  height: 30px;
}
.form_item_btn{
  margin-top: 10px;
  outline: none;
  width: 80px;
  height: 40px;
  background-color: #00B7FF;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.pull-box-enter, .pull-box-leave-to{
  height: 0;
}
.pull-box-enter-active, .pull-box-leave-active{
  transition: all .3s;
}
</style>
