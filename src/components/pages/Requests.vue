<template>
<v-container>
    <requests-table title="الطلبات" icon="receipt" />
</v-container>
</template>

<script>
import RequestsTable from '../tables/RequestsTable'
export default {
  components: {
    RequestsTable
  },
  data(){
    return {
      requests:[]
    }
  }
}
</script>

<style>
</style>
