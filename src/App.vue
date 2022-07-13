<template>
  <div id="app">
    <nav-bar v-if="$ls.get('token')">
      <router-view/>
    </nav-bar>
    <router-view v-else />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="stylus" scoped>


*{
  text-align: right !important;
  font-size-adjust: 0.90 !important;
}
#app {
  font-family: 'Hacen_Beirut';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.inputs-textField-select{
  max-width:200px;
  height:42px;
  font-size: 11px;
}
</style>
