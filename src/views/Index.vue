<template>
  <div id="index">
    <!-- head -->
    <nav-bar></nav-bar>
    <router-view v-if="isReload"></router-view>
  </div>
</template>
<script>
import NavBar from "../components/NavBar/NavBar.vue";
export default {
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      view_title: "",
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
    NavBar,
  },
};
</script>
<style lang="scss" scoped>
</style>
