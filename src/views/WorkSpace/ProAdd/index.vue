<template>
  <div class="pro-add">
    <form>
      <div class="form-item">
        <label class="label-pro-name" for="input-pro-name">项目名称: </label>
        <input class="input-pro-name" id="input-pro-name" type="text" v-model="projectname" placeholder="请输入项目名"/>
      </div>
    </form>
  </div>
</template>

<script>
const uuidV1 = require('uuid/v1');
export default {
  data() {
    return {
      projectname:''
    }
  },
  methods: {
    getProName(){
      let pid = uuidV1();
      let proInfo ={
        pid:pid,
        projectName:this.projectname
      }
      this.$emit('getProInfo',proInfo);
    },
    restForm(){
      this.projectname = null;
    }
  }
}
</script>

<style lang="scss" scoped>
.form-item{
  margin: 20px 0;
  height: 40px;
  line-height: 40px;
}
.label-pro-name{
  margin-right: 5px;
  color: #999;
}
.input-pro-name{
  border: 1px #999 solid;
  outline: none;
  height: 30px;
}
</style>
