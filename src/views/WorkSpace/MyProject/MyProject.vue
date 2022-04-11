<template>
  <div id="my-project">
    <div id="project-title">
      <span class="iconfont icon-folder-fill"></span>
      <span class="title-text">我的项目</span>
    </div>
    <div id="project-content">
      <template v-if="isLogin">
        <template v-if="projectList.length != 0 ? true : false">
          <ul id="project-list">
            <li v-for="(proObj) in projectList" :key="proObj.pid" class="proItem">
              <div class="item-icon" @click="openPro(proObj.pid)">
                <span class="iconfont icon-cad-fill"></span>
                <span class="iconfont icon-close" @click="openModal(proObj.pid,proObj.projectname,$event)"></span>
              </div>
              <span class="item-name">{{proObj.projectname}}</span>
              <span class="item-create">创建时间： {{proObj.createdate}}</span>
              <span class="item-last">修改时间： {{proObj.lastoperate}}</span>
            </li>
          </ul>
        </template>
        <template v-else>
          <span>您还未创建项目！</span>
        </template>
      </template>
      <template v-else>
        <span>您还未登录！</span>
      </template>
    </div>

    <div id="myModal" v-show="isOpenModal">
      <div class="modal-title">
        <h2>删除确认</h2>
      </div>
      <div class="modal-centen">
        <p>您是否删除'{{currentProname}}'项目</p>
      </div>
      <div class="modal-btn">
        <button class="btn-ok" @click="delPro">确认</button>
        <button class="btn-cancel" @click="cancelDel">取消</button>
      </div>
    </div>
    <div id="ModalLayer" v-show="isOpenModal" @click="cancelDel"></div>

  </div>
</template>
<script>
import { getProList, deletePro } from "../../../request/api";
export default {
  inject: ['reload'],
  data() {
    return {
      projectList:[],
      isOpenModal:false,
      currentPid:null,
      currentProname:null
    };
  },
  created() {},
  computed: {
    isLogin(){
      return this.$store.getters.isLogin;
    }
  },
  mounted() {
    this.initProLsit();
  },
  methods: {
    // 打开项目
    openPro(pid){
      sessionStorage.setItem('currentPid',pid);
      this.$router.push({name:'paint',params:{pid}})
    },
    // 删除项目
    delPro(){
      let pid = this.currentPid;
      deletePro(pid).then(res=>{
        if(res.code == '1'){
          this.currentPid = null;
          this.currentProname = null;
          this.isOpenModal = false;
          this.reload();
        }else{
          this.currentPid = null;
          this.currentProname = null;
          this.isOpenModal = false;
          this.reload();
          alert("删除失败");
        }
      })
    },
    // 获取项目列表
    initProLsit(){
      let username = sessionStorage.getItem("userName");
      getProList(username).then(res=>{
        if(res.code == '1'){
          this.projectList = res.data;
        }else{
          console.log("项目类别获取失败")
        }
      })
    },
    // 打开删除确认弹窗
    openModal(pid,projectname,e){
      e.stopPropagation()
      let modalLayer = document.getElementById('ModalLayer');

      modalLayer.style.width = document.body.scrollWidth + "px";
      modalLayer.style.height = document.body.scrollHeight + "px";
      this.currentPid = pid;
      this.currentProname = projectname;
      this.isOpenModal = true;
    },
    // 取消删除弹窗
    cancelDel(){
      this.currentPid = null;
      this.currentProname = null;
      this.isOpenModal = false
    }
  },
};
</script>
<style lang="scss" scoped>
#my-project{
  padding: 2% 0;
}
#project-title{
  color: rgba(255, 0, 0, 0.58);
  font-size: 18px;
}
.title-text{
  color: #777;
  margin-left: 5px;
}
#project-content{
  margin-top: 30px;
  padding: 10px 0;
  border-top: 1px #ccc solid;
}
#project-list{
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
}
.proItem{
  margin: 0 2% 5% 2%;
  width: 16%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.item-icon{
  position: relative;
  width: 100%;
  height: 200px;
  line-height: 200px;
  text-align: center;
  border: 2px #ddd solid;
  border-radius: 15px;
  cursor: pointer;
  overflow: hidden;
}
.item-icon:hover{
  border:2px #00B7FF solid;
}
.item-icon:hover .icon-close{
  transform: translateX(0);
  opacity: 1;
}
.icon-cad-fill{
  color: #00B7FF;
  font-size: 80px;
}
.icon-close{
  position: absolute;
  background-color: red;
  color: #fff;
  font-size: 18px;
  right: 0;
  transform: translateX(100%);
  opacity: 0;
  border-radius: 15px;
  transition: 0.5s;
}
.icon-close
.item-name{
  margin: 10px 0;
  font-size: 20px;
}
.item-create, .item-last{
  margin: 5px 0;
  color: #ccc;
  font-size: 10px;
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
  color: red;
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
#ModalLayer{
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
