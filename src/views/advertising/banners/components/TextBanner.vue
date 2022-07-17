<template>
  <v-card>
    <v-card-title class="mb-0 pb-0">
      <p class="heading mb-0 pb-0">{{ advertiser.name }}</p>
    </v-card-title>
    <v-card-text>
      <p>{{ banner.content }}</p>
      <v-btn :href="banner.external_link">مشاهدة المزيد</v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    banner: {
      type: Object,
      required: true
    },
    advertiser: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style>

</style>
