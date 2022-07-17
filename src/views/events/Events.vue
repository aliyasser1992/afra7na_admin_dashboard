<template>
  <v-container>
      <v-tabs
      grow
      dark
      icons-and-text
      fixed-tabs
      v-model="model"
      style="position:absolute;width:100%;top:0px;left:0;right:0"
    >
      <v-tabs-slider color="red darken-2"></v-tabs-slider>

      <v-tab v-for="(item, index) in categories" :key="index" class="tab" light :href="`#tab-${item.id}`">
        {{ item.title_ar }}
        <v-icon>subject</v-icon>
      </v-tab>
      <v-tabs-items v-model="model">
        <v-tab-item v-for="(item, index) in categories" :key="index" :value="`tab-${item.id}`">
          <v-card flat>
            <v-card-text row >
                <v-layout justify-center>
                  <v-flex md10>
                    <weddings-table v-if="item.id == 1" :cat_id="item.id" :title="item.title_ar" icon="link"/>

                    <occasions-table v-else-if="item.id == 2" :cat_id="item.id" :title="item.title_ar" icon="link"/>

                    <invetations-table v-else-if="item.id == 3" :cat_id="item.id" :title="item.title_ar" icon="link"/>
                  </v-flex>
                </v-layout>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-tabs>
  </v-container>
</template>

<script>
import WeddingsTable from '../../components/tables/WeddingsTable'
import OccasionsTable from '../../components/tables/OccasionsTable'
import InvetationsTable from '../../components/tables/InvetationsTable'

export default {
  data() {
    return {
      categories: [],
      model:"tab-1"
    }
  },
  components: {
    WeddingsTable,
    OccasionsTable,
    InvetationsTable
  },
  created() {
    this.getMainCategories()
  },
  methods: {
    getMainCategories(){
      let app = this
      app.$http.get('admin/main_category')
        .then( res => {

            app.categories = res.data
          }
        )
        .catch( (er) => {
            //
        })
    }
  },
}
</script>

<style>

</style>
