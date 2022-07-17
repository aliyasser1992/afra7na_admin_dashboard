<template>
  <v-container>
    <v-toolbar>
      <v-toolbar-title>تعديل معلن </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn append to="/advertisers" color="info"> العودة </v-btn>
    </v-toolbar>
    <v-card>
      <advertiser-form mode="UPDATE" />
    </v-card>
  </v-container>
</template>

<script>
import AdvertiserForm from './components/AdvertiserForm.vue';
export default {
  components: { AdvertiserForm },

};
</script>

<style>
</style>
