<template>
  <v-form>
    <template v-if="viewMode === 'view'">
      <v-layout class="pa-2" border>
        <v-flex md8>
          <v-card class="pa-3">
            <template v-if="banner.type === 'video'">
              <VideoBanner :banner="banner" />
            </template>
            <template v-if="banner.type === 'image'">
              <v-img :src="defaultAdImage"></v-img>
              <v-flex class="pt-2">
                <p class="headline mb-0 pb-0">
                  {{ selectedAdvertiser ? selectedAdvertiser.name : "" }}
                </p>
                <a href="" class="body-text">{{
                  selectedAdvertiser ? selectedAdvertiser.website : ""
                }}</a>
                <p>{{ banner.content }}</p>
                <v-flex>
                  <v-btn
                    :href="banner.external_link"
                    v-if="banner.external_link"
                    >مشاهدة المزيد</v-btn
                  >
                </v-flex>
              </v-flex>
            </template>
            <template v-else>
              <TextBanner :banner="banner" :advertiser="selectedAdvertiser" />
            </template>
          </v-card>
        </v-flex>
        <v-flex md4 class="pa-4">
          <v-btn color="info" block @click="toggleViewMode('edit')"
            >الرجوع للتعديل</v-btn
          >
        </v-flex>
      </v-layout>
    </template>
    <template v-else>
      <v-layout class="pa-3">
        <v-flex md8>
          <v-layout>
            <v-flex>
              <v-select
                prepend-icon="celebration"
                :items="events.data"
                item-text="title"
                item-value="id"
                label="الاحداث"
                v-model="banner.event_id"
                :error="validationErrors.event_id !== undefined"
                :error-count="
                  validationErrors.event_id
                    ? validationErrors.event_id.length
                    : 0
                "
                :error-messages="
                  validationErrors.event_id ? validationErrors.event_id : []
                "
              ></v-select>
            </v-flex>
            <v-flex>
              <v-select
                prepend-icon="people"
                label="المعلن"
                :items="advertisers.data"
                item-text="name"
                :item-value="(row) => row"
                v-model="selectedAdvertiser"
                :error="validationErrors.advertiser_id !== undefined"
                :error-count="
                  validationErrors.advertiser_id
                    ? validationErrors.advertiser_id.length
                    : 0
                "
                :error-messages="
                  validationErrors.advertiser_id
                    ? validationErrors.advertiser_id
                    : []
                "
              />
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex>
              <v-select
                prepend-icon="edit"
                label="نوع الاعلان"
                :items="types"
                item-text="name"
                item-value="value"
                v-model="banner.type"
                :error="validationErrors.type !== undefined"
                :error-count="
                  validationErrors.type ? validationErrors.type.length : 0
                "
                :error-messages="
                  validationErrors.type ? validationErrors.type : []
                "
              ></v-select>
            </v-flex>
            <v-flex>
              <v-text-field
                type="number"
                prepend-icon="checklist"
                label="موقع الظهور"
                v-model="banner.position"
                :error="validationErrors.position !== undefined"
                :error-count="
                  validationErrors.position
                    ? validationErrors.position.length
                    : 0
                "
                :error-messages="
                  validationErrors.position ? validationErrors.position : []
                "
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-flex>
            <v-text-field
              type="number"
              prepend-icon="attach_money"
              label="سعر الاعلان"
              v-model="banner.price"
              :error="validationErrors.price !== undefined"
              :error-count="
                validationErrors.price ? validationErrors.price.length : 0
              "
              :error-messages="
                validationErrors.price ? validationErrors.price : []
              "
            ></v-text-field>
          </v-flex>
          <v-flex>
            <v-text-field
              prepend-icon="link"
              type="url"
              label="الرابط الخارجي"
              v-model="banner.external_link"
              @keypress="onExternalLinkType"
              @change="onExternalLinkType"
              @input="onExternalLinkType"
              :error="validationErrors.external_link !== undefined"
              :error-count="
                validationErrors.external_link
                  ? validationErrors.external_link.length
                  : 0
              "
              :error-messages="
                validationErrors.external_link
                  ? validationErrors.external_link
                  : []
              "
            ></v-text-field>
          </v-flex>
          <v-flex>
            <v-textarea
              prepend-icon="edit"
              label="محتوي الاعلان"
              v-model="banner.content"
              :error="validationErrors.content !== undefined"
              :error-count="
                validationErrors.content
                  ? validationErrors.category_id.length
                  : 0
              "
              :error-messages="
                validationErrors.content ? validationErrors.content : []
              "
            />
          </v-flex>
        </v-flex>
        <v-flex md-4 class="pa-4">
          <v-flex>
            <p class="title">صورة الاعلان</p>
            <div
              style="border: 1px dashed #1113; height: 200px; cursor: pointer"
              title="اختر صورة الاعلان"
              @click="$refs.file.click()"
            >
              <input
                type="file"
                style="display: none"
                ref="file"
                accept=".png,.jpg,.jpeg"
                @change="handleFileUpload"
              />
              <v-img
                :src="defaultAdImage"
                max-width="100%"
                max-height="100%"
              ></v-img>
            </div>
          </v-flex>
          <v-flex class="mt-3">
            <v-btn color="info" block @click="toggleViewMode('view')"
              >معاينة</v-btn
            >
            <v-btn
              class="red white--text"
              block
              v-if="uploadedFile"
              @click="removeUploadedFile"
              >حذف الصورة</v-btn
            >
            <v-btn color="success" block @click="saveBanner">حفظ</v-btn>
          </v-flex>
        </v-flex>
      </v-layout>
    </template>
  </v-form>
</template>

<script>
import ImagePlaceholder from "../../../../assets/avatar.png";
import VideoBanner from "./VideoBanner.vue";
import TextBanner from "./TextBanner.vue";
import baseURL from "../../../../components/config/baseurl";
import Axios from "axios";
export default {
  props: {
    mode: {
      type: String,
      default: () => "CREATE",
    },
  },
  data() {
    return {
      /**
       * Current form view mode
       * modes ['edit', 'view']
       * toggle between this modes enable you
       * to view advertise and to edit
       */
      viewMode: "edit",
      banner: {
        advertiser_id: null,
        event_id: null,
        type: "image",
        price: null,
        position: null,
        content: null,
        external_link: null,
      },
      types: [
        { name: "نصي", value: "text" },
        { name: "صورة", value: "image" },
        { name: "فيديو", value: "video" },
      ],
      validationErrors: {},
      events: {
        page: 1,
        data: [],
        total: 0,
        paginationList: [],
      },
      advertisers: {
        page: 1,
        data: [],
        total: 0,
        paginationList: [],
      },
      selectedEvent: null,
      selectedAdvertiser: null,
      defaultAdImage: ImagePlaceholder,
      uploadedFile: null,
    };
  },
  mounted() {
    if (this.mode === "UPDATE") {
      this.fetchBanner();
    }
    this.fetchEvents();
    this.fetchAdvertisers();
  },
  methods: {
    fetchBanner() {
      let id = this.$route.params.id;
      this.$http.get(`admin/advertising/banners/${id}`)
      .then(({data}) => {
        this.banner = data;
        this.selectedAdvertiser = this.banner.advertiser;
        this.selectedEvent = this.banner.event;
        if (this.banner.link) {
          this.defaultAdImage = `${baseURL.replace('api','public')}${this.banner.link}`
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    handleFileUpload(e) {
      let file = e.target.files[0];
      if (file) {
        let reader = new FileReader();
        reader.onload = (event) => {
          this.defaultAdImage = event.target.result;
          this.uploadedFile = file;
        };
        reader.readAsDataURL(file);
      }
    },
    removeUploadedFile() {
      this.uploadedFile = null;
      this.defaultAdImage = ImagePlaceholder;
    },
    fetchEvents() {
      this.$http
        .get("admin/event/event-list")
        .then(({ data }) => {
          this.events.data = data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    fetchAdvertisers(page = 1) {
      this.$http
        .get("admin/advertising/advertisers/list")
        .then(({ data }) => {
          this.advertisers.data = data;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    toggleViewMode(mode) {
      this.viewMode = mode;
    },
    onExternalLinkType() {
      if (
        this.banner.external_link &&
        this.banner.external_link.includes("youtube")
      ) {
        this.banner.type = "video";
      }
    },
    saveBanner() {
      if (!this.selectedAdvertiser) {
        this.$swal.fire({
          text: "لم تقوم باختيار المعلن",
          icon: "error",
          toast: true,
        });
        return;
      }
      this.validationErrors = {};
      if (this.mode === "UPDATE") {
        this.updateBanner();
      } else {
        this.createBanner();
      }
    },
    createRequestData() {
      let data = new FormData();
      Object.keys(this.banner).forEach((key) => {
        let val = this.banner[key];
        if (val !== null) {
          data.append(key, val);
        }
      });
      if (this.uploadedFile) {
        data.append("photo", this.uploadedFile);
      }
      data.append("advertiser_id", this.selectedAdvertiser.id);
      return data;
    },
    createBanner() {
      let data = this.createRequestData();
      this.$http
        .post("admin/advertising/banners", data)
        .then((res) => {
          this.$swal.fire({
            text: res.data.message,
            icon: "success",
            toast: true,
          });
        })
        .catch((err) => {
          if (err.response && err.response.status === 422) {
            this.validationErrors = err.response.data.errors;
          } else {
            this.$swal.fire({
              text: "خطا اثناء حفظ الاعلان",
              icon: "error",
              toast: true,
            });
          }
        });
    },
    updateBanner() {
      let data = this.createRequestData();
      data.append('_method', 'PUT');
      let id = this.$route.params.id;
      this.$http.post(`admin/advertising/banners/${id}`,data)
      .then((res) => {
        this.$swal.fire({
          text: res.data.message,
          icon: 'success',
          toast: true,
        });
      }).catch((err) => {
         if (err.response && err.response.status === 422) {
            this.validationErrors = err.response.data.errors;
          } else {
            this.$swal.fire({
              text: "خطا اثناء حفظ الاعلان",
              icon: "error",
              toast: true,
            });
          }u
      })
    },
  },
  components: { VideoBanner, TextBanner },
};
</script>

<style>
</style>
