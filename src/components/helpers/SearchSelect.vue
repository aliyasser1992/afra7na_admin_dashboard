<template>
<div>
  <v-select :placeholder="placeholder" :loading="isLoading" v-model="category_id" :label="label" :items="categories" item-text="title_ar" :item-value="itemValue" ></v-select>
</div>
</template>

<script>
  export default {
    props:['label','endpoint', 'initVal', 'main', 'itemValue', 'placeholder', 'depends'],
    data: () => ({
      descriptionLimit: 60,
      entries: [],
      isLoading: false,
      model: null,
      search: null,
      changed: false,
      categories:[],
      category_id:null,
    }),
    created(){
        this.fetch();
    },
    watch: {
      main (val){
        this.fetch()
      },
      endpoint (val){
        this.fetch()
      },
      category_id(val) {
        this.$emit('returnValue', val)
      }
    },
    methods: {
      fetch () {
        this.isLoading = true
         this.categories = []
            this.$http.get(this.endpoint)
            .then(res => {
              this.categories = []
              if(this.depends)
              this.categories = res.data
              else
              this.categories = res.data.data
            })
            .catch(err => {
            })
            .finally(() => {
              if(this.initVal&&!this.category_id)
                this.category_id = this.initVal
                this.isLoading = false
              })
        }
      }
    }
</script>
