<template>
  <v-container>
    <v-toolbar>
      <v-toolbar-title> <v-icon>credit_card</v-icon> المعلنين</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn append to="/advertisers/add" color="primary">
        <v-icon>add</v-icon>
        <span>إضافة معلن</span>
      </v-btn>
    </v-toolbar>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="advertisers"
        :loading="isLoading"
        no-results-text="لا يوجد نتائج"
        :pagination.sync="pagination"
        :total-items="totalItems"
      >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.id }}</td>
          <td>{{ props.item.name }}</td>
          <td>
            {{ props.item.category ? props.item.category.title_ar : "الجميع" }}
          </td>
          <td>
            {{ props.item.region ? props.item.region.title_ar : "الجميع" }}
          </td>
          <td>{{ props.item.all_categories ? "نعم" : "لا" }}</td>
          <td>{{ props.item.all_regions ? "نعم" : "لا" }}</td>
          <td>{{ props.item.email || "لا يوجد" }}</td>
          <td>{{ props.item.phone || "لا يوجد" }}</td>
          <td>{{ props.item.website || "لا يوجد" }}</td>
          <td>
            <v-btn
              color="yellow black--text"
              small
              circle
              :icon="true"
              :append="true"
              :to="`/advertisers/${props.item.id}/edit`"
            >
              <v-icon>edit</v-icon>
            </v-btn>
          </td>
          <td>
            <v-btn
              color="red white--text"
              small
              circle
              :icon="true"
              @click="removeAdvertiser(props.item.id)"
            >
              <v-icon>delete</v-icon>
            </v-btn>
          </td>
        </template>
        <template slot="pageText" slot-scope="props">
          إظهار النتائج من {{ props.pageStart }} الي {{ props.pageStop }} العدد
          الكلي {{ props.itemsLength }}
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      headers: [
        { text: "#", value: "id", align: true, sortable: true },
        { text: "اسم المعلن", value: "name", align: "right", sortable: true },
        {
          text: "التصنيف",
          value: "category.title_ar",
          align: "right",
          sortable: true,
        },
        {
          text: "المنطقة",
          value: "region.title_ar",
          align: "right",
          sortable: true,
        },
        {
          text: "له اكثر من تصنيف",
          value: "all_categories",
          align: "right",
          sortable: true,
        },
        {
          text: "له اكثر من منطقة",
          value: "all_regions",
          align: "right",
          sortable: true,
        },
        {
          text: "البريد الالكتروني",
          value: "email",
          align: "right",
          sortable: true,
        },
        { text: "رقم الجوال", value: "phone", align: "right", sortable: true },
        {
          text: "الموقع الالكتروني",
          value: "email",
          align: "right",
          sortable: true,
        },
        { text: "التعديل", value: "id" },
        { text: "الحذف", value: "id" },
      ],
      advertisers: [],
      isLoading: false,
      pagination: {},
      totalItems: 0,
    };
  },
  mounted() {
    this.fetchAdvertisers();
  },
  watch: {
    pagination($new, $old) {
      if ($new.page !== $old.page) {
        this.fetchAdvertisers($new.page);
      }
    },
  },
  methods: {
    fetchAdvertisers(page = 1) {
      this.isLoading = true;
      this.$http
        .get("admin/advertising/advertisers", {
          params: {
            page,
          },
        })
        .then((res) => {
          this.advertisers = res.data.data;
          this.pagination = {
            page: res.data.current_page,
            rowsPerPage: res.data.per_page,
          };
          this.totalItems = res.data.total;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    removeAdvertiser(id) {
      let response = confirm("هل تود حقا حذف المعلن");
      if (response) {
        this.$http
          .delete(`admin/advertising/advertisers/${id}`)
          .then((res) => {
            this.$swal.fire({
              text: "تم الحذف بنجاح",
              toast: true,
              icon: "success",
            });
            this.fetchAdvertisers(this.pagination.page);
          })
          .catch((err) => {
            console.log(err)
          });
      }
    },
  },
};
</script>

<style>
</style>
