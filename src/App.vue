<template>
  <div id="app">
    <el-config-provider :locale="locale">
      <router-view />
    </el-config-provider>
  </div>
</template>

<script>
import { ElConfigProvider } from "element-plus";
import zhcn from "element-plus/lib/locale/lang/zh-cn";

export default {
  name: 'App',
  components: {
    [ElConfigProvider.name]: ElConfigProvider,
  },
  setup() {


    // 中文
    let locale = zhcn;

    return {
      locale,

    };
  },
  }

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
