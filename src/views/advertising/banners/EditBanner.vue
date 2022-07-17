<template>
  <v-container>
    <v-toolbar>
      <v-toolbar-title>
        <v-icon>edit</v-icon>
         تعديل اعلان
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn to="/banners" color="info">
        العودة
      </v-btn>
    </v-toolbar>
    <v-card>
      <BannerForm mode="UPDATE" />
    </v-card>
  </v-container>
</template>

<script>
import BannerForm from './components/BannerForm.vue';
export default {
    components: { BannerForm }
}
</script>

<style>

</style>
