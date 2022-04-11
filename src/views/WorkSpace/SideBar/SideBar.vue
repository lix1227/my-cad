<template>
  <div id="sidebar">
    <div id="new">
      <div id="new-btn" @click="createPro">
        <span class="iconfont icon-add-select"></span>
        <span>新建</span>
      </div>
    </div>
    <div id="list">
      <ul class="top">
        <li
          v-for="item in topList"
          :key="item.path"
          :class="item.path == currentPath ? 'active' : ''"
          @click="changeView(item.name, item.meta)"
        >
          <span :class="item.meta.icon"></span>
          <span>{{ item.meta.title }}</span>
        </li>
      </ul>
      <ul class="bottom">
        <li
          v-for="item in bottomList"
          :key="item.path"
          :class="item.path == currentPath ? 'active' : ''"
          @click="changeView(item.name, item.meta)"
        >
          <span :class="item.meta.icon"></span>
          <span>{{ item.meta.title }}</span>
        </li>
      </ul>
      <div class="hr"></div>
      <ul class="nolist">
        <li
          v-for="item in noList"
          :key="item.path"
          :class="item.path == currentPath ? 'active' : ''"
          @click="changeView(item.name, item.meta)"
        >
          <span :class="item.meta.icon"></span>
          <span>{{ item.meta.title }}</span>
        </li>
      </ul>
    </div>
    <div id="myModal" v-show="isOpenModal">
      <div class="modal-title">
        <h2>新建项目</h2>
      </div>
      <pro-add v-on:getProInfo="getProInfo" ref="proAdd"></pro-add>
      <div class="modal-btn">
        <button class="btn-ok" @click="submitPro">确认</button>
        <button class="btn-cancel" @click="cancelSubmit">取消</button>
      </div>
    </div>
    <div id="myModalLayer" v-show="isOpenModal" @click="cancelSubmit"></div>
  </div>
</template>
<script>
import ProAdd from "../ProAdd";
import {valiteProName, createPro} from '@/request/api'
import {dateFormat} from "@/utils/dateFormat";
export default {
  inject: ['reload'],
  components:{
    ProAdd
  },
  data() {
    return {
      currentPath: null,
      topList: [],
      bottomList: [],
      noList: [],
      projectName:null,
      pid:null,
      isOpenModal:false
    };
  },
  created() {
    this.getSideBar();
  },
  mounted() {
    this.getPath();
  },
  methods: {
    getSideBar() {
      let Sideroutes = this.$router.options.routes[0].children[0].children;
      for (let i = 0; i < Sideroutes.length; i++) {
        if (Sideroutes[i].meta.position == "top") {
          this.topList.push(Sideroutes[i]);
        } else if (Sideroutes[i].meta.position == "bottom") {
          this.bottomList.push(Sideroutes[i]);
        } else {
          this.noList.push(Sideroutes[i]);
        }
      }
    },
    changeView() {
      let arg = arguments;
      let name = arg[0];
      let meta = arg[1];
      this.$router.push({ name: name, params: JSON.stringify(meta) });
    },
    getPath() {
      this.currentPath = this.$route.path.split("/")[2];
    },
    // 打开新建项目弹窗
    createPro(){
      let modalLayer = document.getElementById('myModalLayer');

      modalLayer.style.width = document.body.scrollWidth + "px";
      modalLayer.style.height = document.body.scrollHeight + "px";

      this.isOpenModal = true;
    },
    // 创建项目
    submitPro(){
      this.$refs.proAdd.getProName();
      let pid = this.pid;
      let projectname = this.projectName;
      let username = sessionStorage.getItem('userName');
      let createdate = dateFormat(new Date());
      let _this = this;
      if(!projectname){
        alert("项目名不能为空");
        return;
      }
      let param = {
        pid,
        projectname,
        username,
        createdate,
        lastoperate:null
      }
      valiteProName(param).then(res=>{
        if(res.isExit){
          alert("项目名已存在");
          return
        }
        createPro(param).then(_res=>{
          if(_res.code == '1'){
            _this.isOpenModal = false;
            _this.reload();
          }else{
            alert("创建失败");
          }
        })
      })
    },
    // 取消创建项目
    cancelSubmit(){
      this.$refs.proAdd.restForm();
      this.isOpenModal = false
    },
    // 获取项目信息
    getProInfo(proInfo){
      this.pid = proInfo.pid
      this.projectName = proInfo.projectName;
    }
  },
  watch: {
    $route: "getPath",
  },
};
</script>
<style lang="scss" scoped>
#sidebar {
  display: flex;
  flex-direction: column;
  width: 12vw;
  height: 91vh;
  margin-top: 4px;
  background-color: #fff;
  box-shadow: #ededed 5px 0 5px;
}
#new {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  height: 80px;
}
#new-btn {
  font-size: 16px;
  width: 180px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background-color: rgba(255, 0, 0, 0.7);
  color: #fff;
  border-radius: 25px;
  cursor: pointer;
}
#new-btn:hover {
  background-color: rgba(255, 0, 0, 0.5);
}
.icon-add-select {
  margin-right: 10px;
}
#list {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: space-between;
}
#list ul {
  list-style: none;
  width: 100%;
  margin: 10px 0;
  padding: 0;
}
#list ul li {
  display: flex;
  justify-content: center;
  height: 60px;
  line-height: 60px;
  font-size: 16px;
  color: #2991f9;
  cursor: pointer;
  border-left: 5px solid #fff;
}
#list ul li:hover:not(.nolist > li) {
  background-color: #ebf5ff;
  border-left: 5px solid #2991f9 !important;
}
.nolist > li:hover {
  background-color: #ebf5ff;
}
.top {
  flex-grow: 1;
}
.iconfont {
  font-size: 18px;
  margin-right: 10px;
}
.active {
  background-color: #ebf5ff;
  border-left: 5px solid #2991f9 !important;
}
.hr {
  margin: 0 30px;
  height: 0;
  border: #ededed solid 1px;
}
#myModal{
  position: absolute;
  z-index: 11;
  left: 50vw;
  top: 50vh;
  transform: translate(-50%,-50%);
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 15px;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.modal-title{
  color: #777;
}
.modal-btn{
  width: 100%;
  height: 100px;
  line-height: 100px;
}
.modal-btn button{
  border: 1px #ccc solid;
  outline: none;
  width: 120px;
  height: 40px;
  margin: 0 5px;
  opacity: 0.7;
  color: #fff;
  cursor: pointer;
}
.btn-ok{
  background-color: red;
}
.btn-cancel{
  background-color: #333;
}
#myModalLayer{
  position: absolute;
  left:0;
  top:0;
  z-index:10;
  background:#DCDBDC;
  -moz-opacity: 0.8;
  opacity:.80;
  filter: alpha(opacity=80);/* 只支持IE6、7、8、9 */
}
</style>
