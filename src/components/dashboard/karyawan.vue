<template>
    <body>
        <div>
          <b-card style="margin:0; margin-top:5%; box-shadow: 0 0.2rem 0.2rem rgba(0, 0, 0, 0.13)">
              <b-card-title style="font-weight:bold;color:#A53A1D ">
                  Data Karyawan
              </b-card-title>
            <div class="d-flex justify-content-between align-items-center">
                    <input v-model="filter" type="text" class="form-control" style="width:40%"
                        placeholder="Search..." >
                      
                 <b-button @click="adding()" size="md" variant="no-outline" style="margin-bottom:5px;background-color:#EC7309;font-weight:bold;color:white"><b-icon icon="plus"></b-icon>Tambah Karyawan</b-button>
            </div>
                
           <b-table
            id="my-table"
            :per-page="page"
            :current-page="currentPage" 
            triped hover 
            :items="filteredRows" 
            :fields="fields"
            :busy="isBusy" class="mt-3" outlined

            >
            <template #table-busy>
                <div class="text-center text-danger my-2">
                <b-spinner class="align-middle"></b-spinner>
                <strong>Loading...</strong>
                </div>
            </template>


            <template #cell(status_karyawan)="filteredRows">
                <b-badge  v-if="filteredRows.item.status_karyawan==1" variant="success">Aktif</b-badge>
                <b-badge v-else variant="secondary">Tidak Aktif</b-badge>
            </template>

            <template #cell(action)="filteredRows" >
                <b-button variant="no-outline" style="background-color:#EC7309;" class="iconEdit" @click="editForm(filteredRows.item)" v-b-modal.modal-center>
                <b-icon style="color:white" icon="pencil-fill"></b-icon>
                </b-button>
            </template>

            </b-table> 

          </b-card>
          <b-modal v-model="addModal"
            id="modal-prevent-closing"
            ref="modal"
            :title="desc_modal"
            @hidden="resetModal"
            @ok="handleOk">
              
                <form ref="form" @submit.stop.prevent="handleSubmit">
               
               <b-form-group v-if="desc_modal=='Edit Karyawan'"
                   label="Status Karyawan"
                    label-for="status-karyawan-input">
                   <b-input-group>
                    <b-input-group-prepend is-text>
                    <b-form-checkbox v-model="status_karyawan" switch class="mr-n2">
                    </b-form-checkbox>
                    </b-input-group-prepend>
                    <b-form-input disabled v-model="status_feedback"></b-form-input>
                </b-input-group>
               </b-form-group>
               <b-form-group
                    label="Nama Jabatan"
                    label-for="jabatan-input"
                    invalid-feedback="Nama jabatan tidak boleh kosong"
                    :state="jabatanState"
                    >
                    <b-dropdown v-model="nama_jabatan" :text="nama_jabatan" :variant="jabatanVariant">
                        <b-dropdown-item v-for="item in jabatans" :key="item.id_jabatan" @click="chooseJabatan(item)">{{item.nama_jabatan}}</b-dropdown-item>
                     
                    </b-dropdown>
                  </b-form-group>
           
                <b-form-group
                    label="Nama Karyawan"
                    label-for="nama_karyawan-input"
                    invalid-feedback="Nama karyawan tidak boleh kosong"
                    :state="nameState"
                    >
                    <b-form-input
                        id="nama_karyawan-input"
                        v-model="nama_karyawan"
                        :state="nameState"
                        required
                    ></b-form-input>
                    </b-form-group>
                    <b-form-group
                    label="Tanggal Lahir Karyawan"
                    label-for="tanggal_lahir-input"
                    invalid-feedback="Tanggal lahir tidak boleh kosong"
                    >
                      <b-form-datepicker v-model="tanggal_lahir" :state="tglState" locale="en"></b-form-datepicker>

                    </b-form-group>
                    
                    <b-form-group
                    label="Alamat Karyawan"
                    label-for="alamat_karyawan-input"
                    invalid-feedback="Alamat karyawan tidak boleh kosong"
                    :state="alamatState"
                    >
                    <b-form-input
                        id="alamat_karyawan-input"
                        v-model="alamat_karyawan"
                        :state="alamatState"
                        required
                    ></b-form-input>
                    </b-form-group>

                     <b-form-group
                    label="Kontak Karyawan"
                    label-for="kontak_karyawan-input"
                    :invalid-feedback="kontak_feedback"
                    :state="kontakState"
                    >
                    <b-form-input
                        id="kontak_karyawan-input"
                        v-model="kontak_karyawan"
                        :state="kontakState"
                        required
                    ></b-form-input>
                    </b-form-group>

                    <b-form-group
                    label="Email Karyawan"
                    label-for="email_karyawan-input"
                    :invalid-feedback="email_feedback"
                    :state="emailState"
                    >
                    <b-form-input
                    v-if="desc_modal=='Tambah Karyawan'"
                        id="nama_karyawan-input"
                        v-model="email"
                        :state="emailState"
                        required
                    ></b-form-input>
                     <b-form-input
                    v-else
                        id="nama_karyawan-input"
                        v-model="email"
                        :state="emailState"
                        disabled
                    ></b-form-input>
                    </b-form-group>

                    <b-form-group
                    label="Tanggal Masuk Karyawan"
                    label-for="tanggal_karyawan-input"
                    invalid-feedback="Tanggal masuk tidak boleh kosong"
                    >
                      <b-form-datepicker v-model="tanggal_masuk" :state="tanggalState" :min="min" locale="id"></b-form-datepicker>

                    </b-form-group>
                     
                </form>
              <template #modal-footer="{ cancel, ok}">
                <b-button variant="no-otline" style="background-color:#3D322F; color:white" @click="cancel()">
                    Cancel
                </b-button>
                <b-button variant="no-outline" style="background-color:#A53A1D;color:white" @click="ok()">
                    {{desc_modal}}
                </b-button>
            </template>
          </b-modal>
                
        </div>

         <div class="overflow-auto" style="margin-top:20px">
            <b-pagination
            v-model="currentPage"
            :total-rows="count()"
            :per-page="page"
            :current-page="currentPage"
            aria-controls="my-table"
            ></b-pagination>
         </div>

          <b-toast v-model="toast" :title="title" :variant="toastVar" toaster="b-toaster-bottom-center">
          {{error_message}}
        </b-toast >
    </body>
</template>
<script>
import {phoneNumberRegex} from '@/validation/regex'
import {emailRegex} from '@/validation/regex'
export default {
    data(){
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const minDate = new Date(today)

        return{
            page:5,
            currentPage:1,
            
            min: minDate,

            isBusy: false,
            filter:"",
            addModal:false,
            desc_modal:'',
            nama_karyawan:'',
            alamat_karyawan:'',
            kontak_karyawan:'',
            email:'',
            tanggal_masuk:'',
            tanggal_lahir:'',
            nama_jabatan:'Pilih Jabatan',
            id_jabatan:'',
            id_item:'',
            status_karyawan:true,
            status_temp:null,
            
            jabatanState:null,
            nameState:null,
            alamatState:null,
            kontakState:null,
            kontak_feedback:'',
            emailState:null,
            email_feedback:'',
            tanggalState:null,
            tglState:null,
            jabatanVariant:'Light',

            deleteModal:false,
            delete_temp:null,
            rows:[
             ],
            fields:[
                 {key:'id_karyawan',
                 sortable:true},
                 {key: 'nama_karyawan',
                 sortable:true},
                 {key:'kontak_karyawan'},
                 {key:'status_karyawan'},
                 {key: 'action'},
            ],
            jabatans:[],

            toast:false,
            title:'',
            toastVar:'',
            error_message:''
            
        }
    },

    methods:{
        count(){
            return this.filteredRows.length
        },

        toggleBusy() {
        this.isBusy = !this.isBusy
      },
      adding(){
          this.desc_modal='Tambah Karyawan'
          this.addModal=true;
          console.log(this.status_karyawan)
          
      },checkFormValidity() {
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
          } else if(!RegExp(phoneNumberRegex).test(this.kontak_karyawanfalse)==false){
              
              this.kontak_feedback= 'Nomor yang dimasukan tidak valid'
              this.kontakState = false
              error=+1
          }

          if(this.email.length<1){
              this.email_feedback='Kontak Karyawan tidak boleh kosong'
              this.emailState = false
              error=+1
          } else if(!RegExp(emailRegex).test(this.email)){
              
              this.email_feedback= 'Email yang dimasukan tidak valid'
              this.emailState = false
              error=+1
          }
        if(this.tanggal_masuk.length<1){
            this.tanggalState = false
            error=+1
        }
        if(this.tanggal_lahir.length<1){
            this.tanggalState = false
            error=+1
        }
        if(this.nama_jabatan=='Pilih Jabatan'){
            this.jabatanState = false
            this.jabatanVariant='outline-danger'
            error=+1
        }
        return error
      },
      resetModal() {
        this.nama_karyawan = ''
        this.alamat_karyawan= ''
        this.kontak_karyawan=''
        this.email=''
        this.tanggal_masuk=''
        this.tanggal_lahir=''
        this.kontakState=''
        this.emailState=''
        this.nameState = null
        this.alamatState=null
        this.kontakState=null
        this.emailState=null
        this.tanggalState=null
        this.tglState=null
        this.jabatanState=null
        this.jabatanVariant='Light'
        this.nama_jabatan='Pilih Jabatan'
      },
      handleOk(bvModalEvt) {
        bvModalEvt.preventDefault()
        this.handleSubmit()

        if(this.desc_modal=='Tambah Karyawan'){
            console.log(this.desc_modal)
        }
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
        
        if(this.desc_modal=='Tambah Karyawan'){
          this.addData()
        }else
          this.editData()


        this.$nextTick(() => {
          this.$bvModal.hide('modal-prevent-closing')
        })
      },
      editForm(item){
          this.desc_modal='Edit Karyawan'
          this.nama_karyawan=item.nama_karyawan
          this.alamat_karyawan=item.alamat_karyawan
          this.kontak_karyawan=item.kontak_karyawan
          this.email=item.email
          this.tanggal_masuk=item.tanggal_masuk
          this.tanggal_lahir=item.tanggal_lahir
          this.readJabatanbyId(item)
          this.id_item=item.id_karyawan
          this.id_jabatan=item.id_jabatan
          this.status_temp=item.status_karyawan
          if(item.status_karyawan==1){
              this.status_karyawan=true
          }else{
              this.status_karyawan=false
          }
          this.addModal=true   
          console.log(this.tanggal_masuk);  
      },
      readData(){
        var url = this.$api + '/karyawan'
        this.$http.get(url, {
            headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        }).then(response => {
            this.rows = response.data.data
           })
      },
      addData(){
        this.item = new FormData;
            this.item.append('nama_karyawan',this.nama_karyawan);
            this.item.append('id_jabatan',this.id_jabatan);
            this.item.append('tanggal_lahir',this.tanggal_lahir);
            this.item.append('alamat_karyawan',this.alamat_karyawan);
            this.item.append('kontak_karyawan',this.kontak_karyawan);
            this.item.append('email',this.email);
            this.item.append('tanggal_masuk',this.tanggal_masuk);

        var url = this.$api + '/karyawan'
              this.$http.post(url, this.item, {
                headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
              }).then(response => {
                this.error_message = response.data.message;
                this.toastVar='success'
                this.title= 'Success'
                this.toast=true
              }).catch(error => {
                this.error_message = error.response.data.message;
                this.toastVar='danger'
                this.title= 'Warning!!'
                this.toast=true
              })          
              
              this.readData()
      },editData(){
          if(this.status_karyawan==true){
               this.status_temp=1
          }else{
              this.status_temp=0
          }

        let newData = {
          nama_karyawan:this.nama_karyawan,
          id_jabatan:this.id_jabatan,
          alamat_karyawan:this.alamat_karyawan,
          kontak_karyawan:this.kontak_karyawan,
          email:this.email,
          tanggal_masuk:this.tanggal_masuk,
          tanggal_lahir:this.tanggal_lahir,
          status_karyawan:this.status_temp
        };
       
        var url = this.$api + "/update-karyawan/" + this.id_item;
        this.load = true;
        this.$http
          .put(url, newData, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("access_token"),
            },
          })
          .then((response) => {
            this.error_message = response.data.message;
            this.toastVar='success'
            this.title= 'Success'
            this.toast=true
          })
          .catch((error) => {
            this.error_message = error.response.data.message;
            this.toastVar='danger'
            this.title= 'Warning!!'
            this.toast=true
          });
          this.readData()
        },
        chooseJabatan(item){
          this.nama_jabatan=item.nama_jabatan
          this.id_jabatan=item.id_jabatan
      },
      readJabatan(){
        var url = this.$api + '/jabatan'
        this.$http.get(url, {
            headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        }).then(response => {
            this.jabatans = response.data.data
           })
      },
      readJabatanbyId(item){
        var url = this.$api + '/jabatan/'+item.id_jabatan
        this.$http.get(url, {
            headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        }).then(response => {
            this.nama_jabatan= response.data.data.nama_jabatan
           })
      },
         
    },
    beforeMount(){
        this.readData()
        this.readJabatan()
        
    },

    computed:{
    
    status_feedback(){
        if(this.status_karyawan==true){
            return 'Karyawan Aktif'
        }else
            return 'Karyawan Tidak Aktif'
    },
    filteredRows() {
        return this.rows.filter(row => {
        const id_karyawan = row.id_karyawan.toString().toLowerCase();
        const nama_karyawan = row.nama_karyawan.toLowerCase();
        const searchTerm = this.filter.toLowerCase();

        return nama_karyawan.includes(searchTerm) ||
            id_karyawan.includes(searchTerm);
    });
    
  },

    }
}
</script>
<style scoped>
body{

  padding-left: 10%;
  padding-right: 3%;
}
</style>
