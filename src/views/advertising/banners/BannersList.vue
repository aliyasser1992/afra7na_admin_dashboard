<template>
  <v-container>
    <v-toolbar>
      <v-toolbar-title><v-icon>tv</v-icon> الاعلانات</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn to="/banners/add" color="primary">
        <v-icon>add</v-icon>
        اضافة اعلان
      </v-btn>
    </v-toolbar>
    <v-card>
      <v-card-title>
        <v-text-field type="search" placeholder="بحث" v-model="search"></v-text-field>
        <v-icon>search</v-icon>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="banners"
        :pagination.sync="pagination"
        :total-items="total"
        :search="search"
      >
        <template slot="items" slot-scope="props">
          <td>{{ new Date(props.item.created_at).toLocaleString("ar-kw") }}</td>
          <td>{{ props.item.advertiser_name }}</td>
          <td>{{ props.item.advertiser_category }}</td>
          <td>{{ props.item.event_title }}</td>
          <td>{{ props.item.region }}</td>
          <td>{{ props.item.price || "مجاني" }}</td>
          <td>{{ props.item.position }}</td>
          <td>{{ types[props.item.type] }}</td>
          <td>
            <v-img
              :src="generateImageLink(props.item.link)"
              v-if="props.item.link"
            ></v-img>
            <p v-else>لا يوجد</p>
          </td>
          <td>
            <v-btn
              :href="props.item.external_link"
              target="blank"
              v-if="props.item.type === 'video'"
              color="info"
              >مشاهدة</v-btn
            >
            <p v-else>لا يوجد</p>
          </td>
          <td>
            <v-btn
              :to="`/banners/${props.item.id}/edit`"
              color="yellow black--text"
              circle
              :icon="true"
            >
              <v-icon>edit</v-icon>
            </v-btn>
          </td>
          <td>
            <v-btn
              color="red white--text"
              circle
              :icon="true"
              @click="removeBanner(props.item.id)"
            >
              <v-icon>delete</v-icon>
            </v-btn>
          </td>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import baseURL from "../../../components/config/baseurl";
import VideoBanner from "./components/VideoBanner.vue";
export default {
  data() {
    return {
      banners: [],
      headers: [
        {
          text: "تاريخ الاضافة",
          value: "created_at",
          searchable: true,
          sortable: true,
        },
        {
          text: "اسم المعلن",
          value: "advertiser_name",
          searchable: true,
          sortable: true,
        },
        {
          text: "تصنيف المعلن",
          value: "advertiser_category",
          searchable: true,
          sortable: true,
        },
        {
          text: "اسم الحدث",
          value: "event_title",
          searchable: true,
          sortable: true,
        },
        {
          text: "المنطقة",
          value: "region",
          searchable: true,
          sortable: true,
        },
        {
          text: "سعر الاعلان",
          value: "price",
          searchable: true,
          sortable: true,
        },
        {
          text: "موقع الاعلان",
          value: "position",
          searchable: true,
          sortable: true,
        },
        {
          text: "نوع الاعلان",
          value: "type",
          searchable: true,
          sortable: true,
        },
        {
          text: "صورة الاعلان",
          value: "link",
          searchable: true,
          sortable: true,
        },
        {
          text: "فيديو الاعلان",
          value: "link",
          searchable: true,
          sortable: true,
        },
        { text: "تعديل", value: "id", searchable: true, sortable: true },
        { text: "حذف", value: "id", searchable: true, sortable: true },
      ],
      pagination: {
        rowsPerPage: 10,
        page: 1,
        sortBy: "created_at",
        totalItems: 0,
        descending: true,
      },
      total: 1,
      types: {
        text: "نصي",
        image: "صورة",
        video: "فيديو",
      },
      search: null,
      searchTimeout : null,
    };
  },
  mounted() {
    this.fetchBanners();
  },
  watch: {
    pagination($new) {
      this.fetchBanners($new);
    },
    search($new) {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }
      this.searchTimeout = setTimeout(() => {
        this.fetchBanners();
      }, 500);
    }
  },
  methods: {
    createRequestParams(options = {}) {
      return {
        search: this.search,
        sort: options.sortBy || this.pagination.sortBy,
        order: options.descending || this.pagination.descending ? 'desc' : 'asc',
        limit: options.rowsPerPage || this.pagination.rowsPerPage,
        page: options.page || this.pagination.page,
      }
    },
    fetchBanners(options = {}) {
      let params = this.createRequestParams(options);
      console.log(params)
      this.$http
        .get("admin/advertising/banners", {
          params,
        })
        .then(({ data }) => {
          this.banners = data.data;
          /* this.pagination = {
            rowsPerPage: data.per_page,
            page: data.current_page,
            sortBy: "advertiser.category.title_ar",
            totalItems: data.total,
            descending:false,
          }; */
          this.total = data.total;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    generateImageLink(link) {
      let base = baseURL.replace("api", "public/");
      return base + link;
    },
    removeBanner(id) {
      this.$swal
        .fire({
          text: `هل انت متاكد من حذق هذا الاعلان`,
          toast: true,
          icon: "warning",
          showDenyButton: true,
          denyButtonText: "لا",
          confirmButtonText: "نعم",
        })
        .then((response) => {
          if (response.isConfirmed) {
            this.$http
              .delete(`admin/advertising/banners/${id}`)
              .then(() => {
                this.fetchBanners();
              })
              .catch(() => {
                this.$swal.fire({
                  text: "خطأ اثناء حذف الاعلان",
                  icon: "error",
                  toast: true,
                });
              });
          }
        });
    },
  },
  components: { VideoBanner },
};
</script>

<style>
</style>
