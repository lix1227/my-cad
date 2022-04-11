<template>
  <div id="workspace">
    <!-- sidebar -->
    <side-bar></side-bar>
    <div class="container">
      <router-view v-if="isReload"></router-view>
    </div>
  </div>
</template>
<script>
import SideBar from "./SideBar/SideBar.vue";
export default {
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      isReload:true
    };
  },
  created() {},
  computed: {},
  methods: {
    reload() {
      this.isReload = false
      this.$nextTick(() => {
        this.isReload = true
      })
    }
  },
  components: {
    SideBar,
  },
};
</script>
<style lang="scss" scoped>
#workspace {
  display: flex;
}
.container {
  height: 91vh;
  flex-grow: 1;
  padding: 0 50px;
  margin: 5px 0px 0 5px;
  background-color: #f4f9fa;
  overflow-y: scroll;
}
</style>
