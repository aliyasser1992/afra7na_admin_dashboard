<template>
  <v-container>
    <v-toolbar color="success">
      <v-toolbar-title> إضافة معلن جديد </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn append to="/advertisers" color="light"> العودة </v-btn>
    </v-toolbar>
    <v-card>
      <advertiser-form />
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
