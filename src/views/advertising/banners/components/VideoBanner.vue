<template>
  <iframe style="width:100%;height:500px" :src="generateEmbedLink()" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</template>

<script>
export default {
  props: {
    banner: {
      type: Object,
      required: true
    }
  },
  methods: {
    generateEmbedLink() {
      let base = 'https://www.youtube.com/embed';
      let url = new URL(this.banner.external_link);
      let urlParams = new URLSearchParams(url.search);
      let videoLink = urlParams.get('v');
      let embedLink =  `${base}/${videoLink}`;
      return embedLink;
    }
  }
}
</script>

<style>

</style>
