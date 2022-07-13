<template>
<v-container>
    <commerical-requests-table title="طلبات الاعلانات التجارية" icon="list" />
</v-container>
</template>

<script>
import CommericalRequestsTable from '../tables/CommericalRequestsTable'
export default {
  components: {
    CommericalRequestsTable
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
