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

    <v-tab class="tab" @click="fetchRenamingTitles" light href="#tab-1">
      العناوين 
      <v-icon>subject</v-icon>
    </v-tab>

    <v-tab class="tab" @click="fetchRenamingCategories" light href="#tab-2">
      الاقسام الرئيسية 
      <v-icon>crop_din</v-icon>
    </v-tab>

    <v-tab href="#tab-3" @click="fetchRenamingSubCategories">
      الاقسام الفرعية
      <v-icon>filter_none</v-icon>
    </v-tab>

    <v-tab-item
      id="tab-1"
    >
      <v-card flat>
        <v-card-text row >
            <v-layout justify-center>
            <v-flex md10>                
             <renaming-titles-table ref="renamingTitles" tableTitle="تعديل العناوين" icon="subject"/> 
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
             <renaming-categories-table ref="renamingCategories"  title="تعديل مسميات الاقسام الرئيسية" icon="crop_din"/> 
            </v-flex>
            </v-layout>
        </v-card-text>
      </v-card>
    </v-tab-item>

    <v-tab-item
      id="tab-3"
    >
      <v-card flat>
        <v-card-text> 
          <v-layout justify-center>
            <v-flex md10> 
            <renaming-sub-categories-table  ref="renamingSubCategories" title="تعديل مسميات الاقسام الفرعية" icon="filter_none"/> 
            </v-flex>
            </v-layout>
        </v-card-text>
      </v-card>
    </v-tab-item>
  </v-tabs>
</v-container>
</template>

<script>
import RenamingTitlesTable from '../tables/RenamingTitlesTable'
import RenamingCategoriesTable from '../tables/RenamingCategoriesTable'
import RenamingSubCategoriesTable from '../tables/RenamingSubCategoriesTable'
export default {
    components: {
        RenamingTitlesTable,
        RenamingCategoriesTable,
        RenamingSubCategoriesTable
    },
    methods: {
      fetchRenamingTitles(){
        this.$refs.renamingTitles.fetch();
      },
      fetchRenamingCategories(){
        this.$refs.renamingCategories.fetch();
      },
      fetchRenamingSubCategories(){
        this.$refs.renamingSubCategories.fetch();
      }
    }
}
</script>

<style scoped>
    .active.tab{
        color:red;
    }
</style>
