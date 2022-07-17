<template>
  <v-container>
    <v-toolbar>
      <v-toolbar-title>النسخ الاحتياطية <v-icon color="primary">backup</v-icon> </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="info" :disabled="is_backup_btn_disabled" @click="createBackup">
        <v-icon right>backup</v-icon>
        {{backup_btn_title}}
      </v-btn>
    </v-toolbar>
    <v-tabs color="cyan" dark slider-color="red">
      <v-tab v-for="(item, index) in disks" :key="index" @click="toggleCurrentDisk(item.disk)">
        {{ item.name }}
      </v-tab>
    </v-tabs>
    <v-data-table :headers="headers" :items="items" :rows-per-page-items="[25,50,100]" :loading="is_loading_items">
      <template slot="items" slot-scope="props">
        <td>{{ props.item.name }}</td>
        <td>{{ props.item.size }} ميجابايت</td>
        <td>{{ new Date(props.item.last_date_modified).toLocaleString('ar-eg') }}</td>
        <td>
          <a :href="props.item.url" class="">تحميل</a>
        </td>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
export default {

  data() {
    return {
      disks: [
        {name: 'جوجل درايف', disk: 'google'},
        {name: 'المخزن المحلي', disk: 'backup'},
      ],
      headers: [
        { text: 'اسم الملف', value:'name'},
        { text: 'حجم الملف', value:'size'},
        { text: 'اخر تاريخ للتعديل', value:'last_date_modified', sortable:true},
        { text: 'رابط التحميل', value: 'url'}
      ],
      items: [],
      is_loading_items: false,
      backup_btn_title: ' انشاء نسخة احتياطية ',
      is_backup_btn_disabled: false,
      active_disk: 'google',
    }
  },
  methods: {
    getBackupItems() {
      this.is_loading_items = true;
      this.$http.post('admin/backup/files', {
        disk: this.active_disk
      }).then((res) => {

        this.items = res.data;
      }).catch((err) => {
        console.log(err)
      }).finally(() => {
        this.is_loading_items = false;
      })
    },
    createBackup() {
      this.backup_btn_title = "جاري انشاء نسخة احتياطية";
      this.is_backup_btn_disabled=true;

      this.$http.post('admin/backup/create')
      .then((res) => {
        this.getBackupItems();
      }).catch((err) => {
        console.log(err)
      }).finally(() => {
        this.backup_btn_title = "انشاء نسخة احتياطية";
        this.is_backup_btn_disabled = false;
      })
    },
    toggleCurrentDisk(disk) {
      this.active_disk = disk;
      this.getBackupItems();
    }
  },
  mounted() {
    this.getBackupItems();
  }
}
</script>

<style>

</style>
