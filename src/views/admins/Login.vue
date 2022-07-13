<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>
                    لوحة تحكم تطبيق أفراحنا
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                  <v-btn
                    slot="activator"
                    icon
                    large
                    target="_blank"
                  >
                    <v-icon large>person</v-icon>
                  </v-btn>
                  <span>دخول</span>
                </v-tooltip>
              </v-toolbar>
              <form @submit.prevent="login">
              <v-card-text>
                <v-text-field v-model="user.email" prepend-icon="person" name="login" label="البريد الإليكتروني" type="email"></v-text-field>
                <v-text-field v-model="user.password" id="password" prepend-icon="lock" name="password" label="كلمة السر" type="password"></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn type="submit" :loading="connecting" dark color="primary" >دخول</v-btn>
              </v-card-actions>
              </form>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    user:{
      email: null,
      password: null,
    },
    connecting: false,
  }),
  beforeCreate(){
    if(this.$ls.get('token')){
      return this.$router.push('/dashboard/requests')
    }
  },
  methods: {
    login() {
      // alert("hello from login");
      this.connecting = true
      this.$http.post('admin/adminLogin', this.user)
      .then(res=> {
        console.log('res', res);

        this.$ls.set('token', res.data.access_token)
        this.$ls.set('admin', res.data.admin)

        //this.$ls.set('admin', this.user.username, 24 * 60 * 60 * 1000)
        // this.$ls.set('country_id', res.data.admin.default_country, 24 * 60 * 60 * 1000)
        // this.connecting = false
        this.$http.defaults.headers.common['Authorization'] = 'Bearer ' + this.$ls.get('token', null);
        this.$router.push('/events')
      })
      .catch( e => {
        if(e.response.data.error == 'username not found!'){

          }
        else if(e.response.data.error == 'username and password does not match!'){

          }
        else {

          }
          this.connecting = false
      })
    }
  }

}
</script>
