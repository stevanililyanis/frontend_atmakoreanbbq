<template>
    <b-container style="margin-top:6%" >
        <b-card size="sm" style="margin-left:10%;margin-right:10%;background-color:white;box-shadow: 0 0.7rem 1rem rgba(0, 0, 0, 0.15) ">
        <b-card-title style="padding:15px;background-color:#EC7309; color:white; font-weight:bold">
            PROFIL KARYAWAN
        </b-card-title>
        <b-card-body>
        <b-row>
            <b-col cols="4">
                <b-card border-variant="warning">
                    <b-card-img src="https://placekitten.com/g/300/450">
                    </b-card-img>
                </b-card>
                <b-button @click="updatePP=true" block style="margin-top:15px;background-color:#EC7309; font-weight:bold;color:white" variant="no-outline" >Edit Profile Picture</b-button>
                <b-button @click="changePassword=true" block style="margin-top:15px;background-color:#A53A1D;color:white;font-weight:bold" 
                variant="no-outline"><b-icon icon="lock"></b-icon> Ganti Password Akun</b-button>
            </b-col>
            <b-col>
            <form ref="form" @submit.stop.prevent="handleSubmit">
                <b-form-group
                    label="Nama Karyawan"
                    label-for="nama_karyawan-input"
                    label-cols="4" label-cols-lg="4"
                    style="text-align:left"
                    invalid-feedback="Nama karyawan tidak boleh kosong"
                    :state="nameState"
                    >
                    <b-form-input
                    v-if="editData==false"
                        id="nama_karyawan-input"
                        v-model="nama_karyawan"
                        :state="nameState"
                        disabled
                        required
                    ></b-form-input>
                    <b-form-input
                    v-else
                        id="nama_karyawan-input"
                        v-model="nama_karyawan"
                        :state="nameState"
                        required
                    ></b-form-input>
                    </b-form-group>
                    <b-form-group
                    label-cols="4" label-cols-lg="4"
                    label="Tanggal Lahir"
                    style="text-align:left"
                    label-for="tanggal_lahir-input"
                    invalid-feedback="Tanggal lahir tidak boleh kosong"
                    >
                      <b-form-datepicker v-if="editData==false" disabled v-model="tanggal_lahir" :state="tglState" locale="en"></b-form-datepicker>
                       <b-form-datepicker v-else v-model="tanggal_lahir" :state="tglState" locale="en"></b-form-datepicker>

                    </b-form-group>
                    
                    <b-form-group
                    label-cols="4" label-cols-lg="4"
                    style="text-align:left"
                    label="Alamat Karyawan"
                    label-for="alamat_karyawan-input"
                    invalid-feedback="Alamat karyawan tidak boleh kosong"
                    :state="alamatState"
                    >
                    <b-form-textarea
                    v-if="editData==false"
                        id="alamat_karyawan-input"
                        v-model="alamat_karyawan"
                        :state="alamatState"
                        required
                        disabled
                    ></b-form-textarea>
                    <b-form-textarea
                    v-else
                        id="alamat_karyawan-input"
                        v-model="alamat_karyawan"
                        :state="alamatState"
                        required
                    ></b-form-textarea>
                    </b-form-group>

                     <b-form-group
                    label-cols="4" label-cols-lg="4"
                    style="text-align:left"
                    label="Kontak Karyawan"
                    label-for="kontak_karyawan-input"
                    :invalid-feedback="kontak_feedback"
                    :state="kontakState"
                    >
                    <b-form-input
                    v-if="editData==false"
                        id="kontak_karyawan-input"
                        v-model="kontak_karyawan"
                        :state="kontakState"
                        required
                        disabled
                    ></b-form-input>
                    <b-form-input
                    v-else
                        id="kontak_karyawan-input"
                        v-model="kontak_karyawan"
                        :state="kontakState"
                        required
                    ></b-form-input>
                    </b-form-group>

                    <b-form-group
                    label-cols="4" label-cols-lg="4"
                    style="text-align:left"
                    label="Email"
                    label-for="email_karyawan-input"
                    :invalid-feedback="email_feedback"
                    :state="emailState"
                    >
                     <b-form-input
                        id="nama_karyawan-input"
                        v-model="email"
                        :state="emailState"
                        disabled
                    ></b-form-input>
                    </b-form-group>
                    <b-form-group
                    label-cols="4" label-cols-lg="4"
                    style="text-align:left"
                    label="Jabatan"
                    label-for="jabatan_karyawan-input"
                    >
                     <b-form-input
                        id="jabatan_karyawan-input"
                        v-model="jabatan"
                        disabled
                    ></b-form-input>
                    </b-form-group>

                    <b-form-group
                    label-cols="4" label-cols-lg="4"
                    style="text-align:left"
                    label="Tanggal Masuk"
                    label-for="tanggal_karyawan-input"
                    invalid-feedback="Tanggal masuk tidak boleh kosong"
                    >
                      <b-form-datepicker disabled v-model="tanggal_masuk" :state="tanggalState" locale="id"></b-form-datepicker>

                    </b-form-group>
                    <b-button v-if="editData==false" @click="editData=true" block style="background-color:#EC7309; font-weight:bold;color:white" variant="no-outline">
                    Edit Data Profile
                </b-button>
                <b-button v-else block  @click="handleOk">
                    Update Data Profile
                </b-button>  
                </form>
            </b-col>
        </b-row>
        </b-card-body>
    </b-card>

     <b-modal
           v-model="updatePP"
           title="Ganti Profile Picture"
           @ok="uploadPP"
           id="modal-center"
           centered>
            
            <b-form-group
                    label="Profile Picture"
                    label-for="gambar_menu-input"
                    >
                    <b-form-file
                    v-model="profile_pict"
                    placeholder="Pilih atau drop profile picture"
                    drop-placeholder="Drop gambar disini"
                    ></b-form-file>
            </b-form-group>

                <template #modal-footer="{ cancel, ok}">
                <b-button variant="no-otline" style="background-color:#3D322F; color:white" @click="cancel()">
                    Cancel
                </b-button>
                <b-button variant="no-outline" style="background-color:#A53A1D;color:white" @click="ok()">
                    Update
                </b-button>
                </template>
          </b-modal>

          <b-modal
           v-model="changePassword"
           title="Ubah password akun"
           @ok="change_pass"
           id="modal-center"
           centered>
            
            <b-form-group
            label-cols="4" label-cols-lg="4"
            style="text-align:left"
            label="Email"
            label-for="email_karyawan-input"
            :invalid-feedback="email_feedback"
            :state="emailState"
            >
                     <b-form-input
                        id="nama_karyawan-input"
                        v-model="email"
                        :state="emailState"
                        disabled
                    ></b-form-input>
            </b-form-group>

            <b-form-group
            label-cols="4" label-cols-lg="4"
            style="text-align:left"
            label="Password Baru"
            label-for="password_karyawan-input"
            :invalid-feedback="email_feedback"
            :state="passwordState"
            >
                     <b-form-input
                        id="nama_karyawan-input"
                        v-model="password"
                        :state="passwordState"
                    ></b-form-input>
            </b-form-group>
           

            <template #modal-footer="{ cancel, ok}">
            <b-button variant="no-otline" style="background-color:#3D322F; color:white" @click="cancel()">
                Cancel
            </b-button>
            <b-button variant="no-outline" style="background-color:#A53A1D;color:white" @click="ok()">
                Ubah Password
            </b-button>
            </template>
        </b-modal>
    </b-container>

</template>
<script>
import {phoneNumberRegex} from '@/validation/regex'
export default {
    data(){
        return{
            editData:false,
            nama_karyawan:'',
            alamat_karyawan:'',
            kontak_karyawan:'',
            email:'',
            tanggal_masuk:'',
            tanggal_lahir:'',
            jabatan:'',
            id_jabatan:'',
            password:'',
            status_karyawan:'',
        
            
            nameState:null,
            alamatState:null,
            kontakState:null,
            kontak_feedback:'',
            emailState:null,
            email_feedback:'',
            tanggalState:null,
            tglState:null,
            passwordState:null,
            id_karyawan:'',
            updatePP:false,
            profile_pict:null,
            changePassword:false,
          
        }
    },
    beforeMount(){
        this.readData()
    },
    methods:{
        readData(){
        var url = this.$api + '/karyawan/'+ localStorage.getItem('email')
        this.$http.get(url, {
            headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        }).then(response => {
            this.nama_karyawan = response.data.data.nama_karyawan
            this.tanggal_lahir = response.data.data.tanggal_lahir
            this.alamat_karyawan =response.data.data.alamat_karyawan
            this.kontak_karyawan = response.data.data.kontak_karyawan
            this.email = response.data.data.email
            this.tanggal_masuk = response.data.data.tanggal_masuk
            this.id_karyawan= response.data.data.id_karyawan
            this.status_karyawan=response.data.data.status_karyawan
            this.readJabatan(response.data.data.id_jabatan)
           })
      },
      readJabatan(item){
           var url = this.$api + '/jabatan/'+item
        this.$http.get(url, {
            headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        }).then(response => {
            this.id_jabatan=item
            this.jabatan = response.data.data.nama_jabatan
           })
      },
      handleOk(bvModalEvt) {
        bvModalEvt.preventDefault()
        this.handleSubmit()
      },
      handleSubmit() {
        this.nameState = null
        this.alamatState=null
        this.kontakState=null
        this.emailState=null
        this.tanggalState=null
        this.tglState=null
        this.jabatanState=null
        this.jabatanVariant='Light'
   
        if (this.checkFormValidity()>0) {
          return
        }

        this.updateData()
        this.$nextTick(() => {
          this.$bvModal.hide('modal-prevent-closing')
        })
        this.editData=false
      },
      checkFormValidity() {
        var error=0;
        if(this.nama_karyawan.length<1){
            this.nameState = false
            error=+1
        }
        if(this.alamat_karyawan.length<1){
            this.alamatState = false
            error=+1
        }
        if(this.kontak_karyawan.length<1){
              this.kontak_feedback='Kontak Karyawan tidak boleh kosong'
              this.kontakState = false
              error=+1
          } else if(!RegExp(phoneNumberRegex).test(this.kontak_karyawan)){
              
              this.kontak_feedback= 'Nomor yang dimasukan tidak valid'
              this.kontakState = false
              error=+1
          }
     
        if(this.tanggal_lahir.length<1){
            this.tanggalState = false
            error=+1}
        return error
      },
      updateData(){
          let newData = {
          nama_karyawan:this.nama_karyawan,
          id_jabatan:this.id_jabatan,
          alamat_karyawan:this.alamat_karyawan,
          kontak_karyawan:this.kontak_karyawan,
          email:this.email,
          tanggal_masuk:this.tanggal_masuk,
          tanggal_lahir:this.tanggal_lahir,
          status_karyawan:this.status_karyawan
        };
       
        var url = this.$api + "/update-karyawan/" + this.id_karyawan;
        this.load = true;
        this.$http
          .put(url, newData, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("access_token"),
            },
          })
          .then((response) => {
            this.error_message = response.data.message;
          })
          .catch((error) => {
            this.error_message = error.response.data.message;

          });
          this.readData()
      },
      uploadPP(){
          console.log(this.profile_pict)
          let newData = {
          profile_pict:this.profile_pict
        };
        console.log(newData.profile_pict)
       
        var url = this.$api + "/update-pp-karyawan/" + this.id_karyawan;
        this.load = true;
        this.$http
          .put(url, newData, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("access_token"),
            },
          })
          .then((response) => {
            this.error_message = response.data.message;
          })
          .catch((error) => {
            this.error_message = error.response.data.message;

          });
          this.readData()
      }
    }
}
</script>