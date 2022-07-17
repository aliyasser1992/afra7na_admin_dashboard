<template>
  <v-form>
    <v-layout class="pa-3">
      <!-- Advertiser Info. -->
      <v-flex md8>
        <v-layout>
          <v-flex md-6>
            <v-select
              prepend-icon="tag"
              label="التصنيف"
              v-model="advertiser.category_id"
              :items="categories"
              item-text="title_ar"
              item-value="id"
              :error="validationErrors.category_id !== undefined"
            :error-count="validationErrors.category_id ? validationErrors.category_id.length : 0"
            :error-messages="validationErrors.category_id ? validationErrors.category_id : []"
            ></v-select>
          </v-flex>
          <v-flex md-6>
            <v-select
              prepend-icon="place"
              label="المنطقة"
              v-model="advertiser.region_id"
              :items="regions"
              item-text="title_ar"
              item-value="id"
              :error="validationErrors.region_id !== undefined"
            :error-count="validationErrors.region_id ? validationErrors.region_id.length : 0"
            :error-messages="validationErrors.region_id ? validationErrors.region_id : []"
            ></v-select>
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex md6>
            <v-checkbox
              label="كل التصينفات"
              v-model="advertiser.all_categories"
              :error="validationErrors.all_categories !== undefined"
            :error-count="validationErrors.all_categories ? validationErrors.all_categories.length : 0"
            :error-messages="validationErrors.all_categories ? validationErrors.all_categories : []"
            ></v-checkbox>
          </v-flex>
          <v-flex md6>
            <v-checkbox
              label="كل المناطق"
              v-model="advertiser.all_regions"
              :error="validationErrors.all_regions !== undefined"
            :error-count="validationErrors.all_regions ? validationErrors.all_regions.length : 0"
            :error-messages="validationErrors.all_regions ? validationErrors.all_regions : []"
            ></v-checkbox>
          </v-flex>
        </v-layout>
        <v-flex>
          <v-text-field
            prepend-icon="person"
            label="اسم المعلن"
            v-model="advertiser.name"
            :error="validationErrors.name !== undefined"
            :error-count="validationErrors.name ? validationErrors.name.length : 0"
            :error-messages="validationErrors.name ? validationErrors.name : []"
          ></v-text-field>
        </v-flex>
        <v-flex>
          <v-text-field
            prepend-icon="mail"
            label="البريد الالكتروني"
            v-model="advertiser.email"
            :error="validationErrors.email !== undefined"
            :error-count="validationErrors.email ? validationErrors.email.length : 0"
            :error-messages="validationErrors.email ? validationErrors.email : []"
          ></v-text-field>
        </v-flex>
        <v-flex>
          <v-text-field
            prepend-icon="smartphone"
            label="رقم الجوال"
            v-model="advertiser.phone"
            :error="validationErrors.phone !== undefined"
            :error-count="validationErrors.phone ? validationErrors.phone.length : 0"
            :error-messages="validationErrors.phone ? validationErrors.phone : []"
          ></v-text-field>
        </v-flex>
        <v-flex>
          <v-text-field
            prepend-icon="language"
            label="الموقع الالكتروني"
            v-model="advertiser.website"
            :error="validationErrors.website !== undefined"
            :error-count="validationErrors.website ? validationErrors.website.length : 0"
            :error-messages="validationErrors.website ? validationErrors.website : []"
          ></v-text-field>
        </v-flex>
      </v-flex>
      <!-- Advertiser Image and control -->
      <v-flex md4>
        <v-flex md10 class="mx-auto">
          <input type="file" ref="upload" style="display: none" @change="handleFileUpload" />
          <v-img :src="avatar"  style="cursor:pointer" ref="avatarPlaceholder"></v-img>
        </v-flex>
        <v-flex md10 v-if="advertiserImage" class="mx-auto">
          <v-btn color="red white--text" block  @click="removeUploadedFile">
            <v-icon>delete</v-icon> حذف الصورة
          </v-btn>
        </v-flex>
        <v-flex md10 class="mx-auto">
          <v-btn color="success" block @click="saveAdvertiser">حفظ</v-btn>
        </v-flex>
      </v-flex>
    </v-layout>
  </v-form>
</template>

<script>
import DefaultAvatar from "../../../../assets/avatar.png"
export default {
  props: {
    mode: {
      type: String,
      default: () => "CREATE",
    },
  },
  data() {
    return {
      advertiser: {
        name: null,
        email: null,
        phone: null,
        website: null,
        all_categories: false,
        all_regions: false,
        region_id: null,
        category_id: null,
      },
      avatar: DefaultAvatar,
      advertiserImage: null,
      regions: [],
      categories: [],
      validationErrors: {},
    };
  },
  mounted() {
    if (this.mode === "UPDATE") {
      this.fetchAdvertiser();
    }

    this.fetchAllRegions();
    this.fetchAllCategories();
  },
  methods: {

    fetchAdvertiser() {
      let id = this.$route.params.id;
      this.$http.get(`admin/advertising/advertisers/${id}`)
      .then(res => this.advertiser = res.data)
      .catch(err => {
        console.log(err)
        this.$swal.fire({
          text: 'خطأ اثناء تحضير بيانات المعلن',
          icon: 'error',
          toast: true
        })
      })
    },

    handleFileUpload(event) {
      console.log(event);
      let file = event.target.files[0];
      if (file) {
        this.advertiserImage = file;
        let reader = new FileReader();
        reader.onload = (e) => {
          /* this.$refs.avatarPlaceholder.src = e.target.result; */
          this.avatar = e.target.result;
        }

        reader.readAsDataURL(file);
      }
    },
    removeUploadedFile() {
      this.advertiserImage = null;
      this.avatar = DefaultAvatar;
    },
    fetchAllCategories() {
      this.$http.get('admin/ads-category')
      .then(({data}) => {
        this.categories = data.data
      }).catch((err) => {
        console.log(err)
      })
    },
    fetchAllRegions() {
      this.$http.get('admin/region')
      .then(({data}) => {
        this.regions = data.data
      }).catch((err) => {
        console.log(err)
      })
    },

    saveAdvertiser() {
      if (this.mode === "UPDATE") {
        this.updateAdvertiser();
      } else {
        this.createAdvertiser();
      }
    },
    prepareRequestData() {
      let advertiser = new FormData();
      Object.keys(this.advertiser).forEach((key) => {
        if (this.advertiser[key] !== null) {
          advertiser.append(key, this.advertiser[key])
        }
      });
      if (this.advertiserImage) {
        advertiser.append('avatar', this.advertiserImage);
      }

      return advertiser;
    },
    createAdvertiser() {

      let advertiser = this.prepareRequestData();
      this.$http.post('admin/advertising/advertisers', advertiser)
      .then(({data}) => {
        console.log(data)
        this.$swal.fire({
          text: 'تم اضافة المعلن بنجاح',
          toast: true,
          icon: 'success'
        });
      }).catch((err) => {
        if (err.response && err.response.status === 422) {
          this.validationErrors = err.response.data.errors
        } else {
          this.$swal.fire({
            text: 'خطأ اثناء حفظ المعلن',
            icon:'error',
            toast:true
          })
        }

      })
    },

    updateAdvertiser() {

      let id = this.$route.params.id;
      this.$http.put(`admin/advertising/advertisers/${id}`, this.advertiser)
      .then((data) => {
        this.$swal.fire({
          text: 'تم تعديل المعلن بنجاح',
          toast: true,
          icon: 'success'
        });
      }).catch((err) => {
        if (err.response && err.response.status === 422) {
          this.validationErrors = err.response.data.errors
        } else {
          this.$swal.fire({
            text: 'خطأ اثناء تعديل المعلن',
            icon:'error',
            toast:true
          })
        }
      })
    }
  }
};
</script>

<style>
</style>
