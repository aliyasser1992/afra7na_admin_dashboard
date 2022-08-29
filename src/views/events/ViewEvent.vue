<template>
  <div>
    <v-container>
      <v-card v-if="event" class="elevation-5">
        <div>
          <v-card-title>
            <p class="display-1 primary--text">
              عرض {{ event.title }}
            </p>
          </v-card-title>
          <v-card-text>{{ event.description }}</v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="$router.back()">العودة</v-btn>
          </v-card-actions>
        </div>
        <v-layout row wrap>
          <v-flex xs12  class="">
            <v-img :src="generateUrl(event.special_image)"></v-img>
          </v-flex>
          <v-flex md4 xs12 v-for="media in event.media" :key="media.id">
            <v-card flat tile class="mx-2 my-3 elevation-5">
              <v-img :src="generateUrl(media.image)"></v-img>
            </v-card>
          </v-flex>
        </v-layout>
      </v-card>
      <v-progress-linear v-else :indeterminate="true"></v-progress-linear>
    </v-container>
  </div>
</template>

<script>
import baseURL from '../../components/config/baseurl';
export default {
  data() {
    return {
      event: null
    }
  },
  mounted() {
    this.fetchEvent();
  },
  methods: {
    fetchEvent() {
      this.$http.get(`admin/event/${this.$route.params.id}`)
      .then((res) => {
        this.event = res.data;
      }).catch(err => {
        console.log(err)
      })
    },
    generateUrl(url) {
      return baseURL.replace('api','public') +url;
    }
  }
}
</script>

<style>

</style>
