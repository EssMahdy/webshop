<template>
  <div class="container">
    <Menu></Menu>
    <IndexPage></IndexPage>
  </div>
</template>

<script>
import Menu from './components/Menu.vue';
import IndexPage from './components/IndexPage.vue';

export default {
  name: 'App',
  components: {
    Menu,
    IndexPage
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>




