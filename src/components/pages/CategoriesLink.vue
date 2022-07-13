<template>
<v-container>
    <v-tabs
    grow
    dark
    icons-and-text
    fixed-tabs
    style="position:absolute;width:100%;top:0px;left:0;right:0"
  >
    <v-tabs-slider color="red darken-2"></v-tabs-slider>

    <v-tab class="tab" light href="#tab-1">
      التصنيفات 
      <v-icon>subject</v-icon>
    </v-tab>

    <v-tab class="tab" light href="#tab-2">
      التصنيفات الفرعية
      <v-icon>crop_din</v-icon>
    </v-tab>


    <v-tab-item
      id="tab-1"
    >
      <v-card flat>
        <v-card-text row >
            <v-layout justify-center>
            <v-flex md10>                
             <categories-table title="التصنيفات" icon="link"/>
            </v-flex>
            </v-layout>
        </v-card-text>
      </v-card>
    </v-tab-item>

    <v-tab-item
      id="tab-2"
    >
      <v-card flat>
        <v-card-text row >
            <v-layout justify-center>
            <v-flex md10>                
             <sub-categories-table title="التصنيفات الفرعية" icon="link"/>
            </v-flex>
            </v-layout>
        </v-card-text>
      </v-card>
    </v-tab-item>
  </v-tabs>
</v-container>
</template>

<script>
import CategoriesTable from '../tables/CategoriesTable'
import SubCategoriesTable from '../tables/SubCategoriesTable'
export default {
    components: {
        CategoriesTable,
        SubCategoriesTable
    }
}
</script>

<style>

</style>
