<template>
  <div>
    <div class="text-xs-center">
      <!-- <v-btn
        :color="color"
        @click="alert = !alert"
      >
        اغلاق
      </v-btn> -->
    </div>
    <v-alert
      :type="type"
      :value="alert"
      transition="scale-transition"
      outline
      dismissible
    >
      {{message}}
    </v-alert>
  </div>
</template>

<script>
  export default {
        props:{
            color:{
                default: 'primary',
                type: String
            },
            message: {
                default: '',
                type: String
            },
            type: {
                default: 'success',
                type: String
            }
        },
      data() {
        return {
            alert: false
        }
    },
    watch: {
        message: function (newVal, oldVal) {
            if(this.message.length >0){

                this.alert = true
                setTimeout(() => {
                    this.alert = false;
                    this.$emit('message')
                }, 3000);
            }
        }
    }
  }
</script>