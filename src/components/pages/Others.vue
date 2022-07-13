<template>
<v-container grid-list-xs>
    <v-layout row justify-center>
        <v-dialog v-model="socialDialog"  max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">التواصل</span>
                </v-card-title>
                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex xs12>
                                <v-text-field outline placeholder=" " label="*الجوال" required v-model="about.phone"></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field outline placeholder=" " label="*فيسبوك" v-model="about.facebook" required></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field outline placeholder=" " label="*تويتر" v-model="about.twitter" required></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field outline placeholder=" " label="*انستاجرام" v-model="about.instegram" required></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field outline placeholder=" " label="*واتساب" v-model="about.whatsapp" required></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field outline placeholder=" " label="*يوتيوب" v-model="about.youtube" required></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-text-field outline placeholder=" " label="سناب شات" v-model="about.snapchat" required></v-text-field>
                            </v-flex>
                            <v-flex xs12>
                                <v-textarea outline placeholder=" " label="ملاحظات فنية" required v-model="about.technicalnotes"></v-textarea>
                            </v-flex>
                            <v-flex xs12>
                                <v-textarea outline placeholder=" " label="ملاحظات فنية EN" required v-model="about.technicalnotes_en"></v-textarea>
                            </v-flex>
                        </v-layout>
                    </v-container>
                    <small>*الحقل مطلوب</small>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="grey darken-1" flat @click.native="socialDialog = false">اغلاق</v-btn>
                    <v-btn color="blue darken-1" flat @click="submitAbout" :loading="loadBtn">حفظ</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
    <v-layout row justify-center>
        <v-dialog v-model="aboutDialog"  max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">عنا</span>
                </v-card-title>
                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex xs12>
                                <v-textarea outline placeholder=" " label="*تفاصيل بالعربية" required v-model="about.discription_ar"></v-textarea>
                            </v-flex>
                            <v-flex xs12>
                                <v-textarea outline placeholder=" " label="*تفاصبل بالانجليزية" required v-model="about.discription_en"></v-textarea>
                            </v-flex>
                        </v-layout>
                    </v-container>
                    <small>*الحقل مطلوب</small>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="grey darken-1" flat @click.native="aboutDialog = false">اغلاق</v-btn>
                    <v-btn color="blue darken-1" flat @click.native="submitAbout" :loading="loadBtn">حفظ</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
    <v-layout row justify-center>
        <v-dialog v-model="rulesDialog"  max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">الشروط و الاحكام</span>
                </v-card-title>
                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex xs12>
                                <v-textarea outline placeholder=" " label="*تفاصيل بالعربية" required v-model="rule.description_ar"></v-textarea>
                            </v-flex>
                            <v-flex xs12>
                                <v-textarea outline placeholder=" " label="*تفاصبل بالانجليزية" required v-model="rule.description_en"></v-textarea>
                            </v-flex>
                        </v-layout>
                    </v-container>
                    <small>*الحقل مطلوب</small>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="grey darken-1" flat @click.native="rulesDialog = false">اغلاق</v-btn>
                    <v-btn color="blue darken-1" flat @click.native="submitRules" :loading="loadBtn">حفظ</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
    <v-card >
        <v-card-title primary-title>
            <div>
                <h3 class="headline mb-0"><v-icon large>settings</v-icon>اعدادات عامة</h3>
            </div>
        </v-card-title>
        <v-card-actions>
            <v-btn flat color="primary" @click="aboutDialog = true"> <v-icon>info</v-icon> عنا</v-btn>
            <v-btn flat color="primary" @click="socialDialog = true"><v-icon>link</v-icon>التواصل</v-btn>
            <v-btn flat color="primary" @click="rulesDialog = true"><v-icon>gavel</v-icon>الشروط و الاحكام</v-btn>
        </v-card-actions>
    </v-card>
</v-container>
</template>

<script>
export default {
    data() {
        return {
            socialDialog: false,
            aboutDialog: false,
            rulesDialog: false,
            loadBtn: false,
            about: {
                id: null,
                discription_ar: "",
                discription_en: "",
                phone: "",
                facebook: "",
                twitter: "",
                instegram: "",
                snapchat: "",
                youtube: "",
                whatsapp: "",
                technicalnotes: "",
                technicalnotes_en: "",
            },
            rule: {
                id: null,
                description_ar: "",
                description_en: ""
            }
        }
    },
    created() {
        this.fetch();
    },
    methods: {
        fetch() {
            this.$http.get(`api/admin/others`)
            .then(res => {
                this.about = res.data.about
                this.rule = res.data.rules
            })
        },
        submitAbout() {
            this.loadBtn = true;
            this.$http.put(`api/admin/others/about/${this.about.id}`, this.about)
            .then(res => {
                this.aboutDialog = false;
                this.socialDialog = false;
                this.loadBtn = false;
            })
            .catch( ({response}) => {
                this.loadBtn = false;
            })
        },
        submitRules() {
            this.loadBtn = true;
            this.$http.put(`api/admin/others/rules/${this.rule.problem_id}`, this.rule)
            .then(res => {
                this.rulesDialog = false;
                this.loadBtn = false;
            })
            .catch( ({response}) => {
                this.loadBtn = false;
            })
        }
    }
}
</script>

<style>

</style>
