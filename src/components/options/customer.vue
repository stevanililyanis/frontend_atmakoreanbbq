<template>
    <body>
        <div>
        <b-button to="/home" size="md" variant="no-outline" style="margin-bottom:20px;background-color:#A53A1D;font-weight:bold;color:white"><b-icon icon="arrow-bar-left"></b-icon> Kembali</b-button>
          <b-card style="margin:0; box-shadow: 0 0.2rem 0.2rem rgba(0, 0, 0, 0.13)">
              <b-card-title style="font-weight:bold;color:#A53A1D ">
                  Data Customer
              </b-card-title>
            <div class="d-flex justify-content-between align-items-center">
                    <input v-model="filter" type="text" class="form-control" style="width:40%"
                        placeholder="Search..." >
                      
                 <b-button @click="adding()" size="md" variant="no-outline" style="margin-bottom:5px;background-color:#EC7309;font-weight:bold;color:white"><b-icon icon="plus"></b-icon>Tambah Customer</b-button>
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
            <template #cell(action)="filteredRows" >
                <b-button variant="no-outline" style="background-color:#EC7309;" class="iconEdit" @click="editForm(filteredRows.item)" v-b-modal.modal-center>
                <b-icon style="color:white" icon="pencil-fill"></b-icon>
                </b-button>
                
                <b-button style="margin-left:5px" variant="outline-danger" class="iconDelete" @click="deleteItem(filteredRows.item)" v-b-modal.modal-delete>
                <b-icon icon="X"></b-icon>
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
           
                <b-form-group
                    label="Nama Customer"
                    label-for="nama_customer-input"
                    invalid-feedback="Nama customer tidak boleh kosong"
                    :state="nameState"
                    >
                    <b-form-input
                        id="nama_customer-input"
                        v-model="nama_customer"
                        :state="nameState"
                        required
                    ></b-form-input>
                    </b-form-group>
                    

                     <b-form-group
                    label="Kontak Customer"
                    label-for="kontak_customer-input"
                    :invalid-feedback="kontak_feedback"
                    :state="kontakState"
                    >
                    <b-form-input
                        id="kontak_customer-input"
                        v-model="kontak_customer"
                        :state="kontakState"
                        required
                    ></b-form-input>
                    </b-form-group>

                    <b-form-group
                    label="Email Customer"
                    label-for="email_customer-input"
                    :invalid-feedback="email_feedback"
                    :state="emailState"
                    >
                    <b-form-input
                        id="nama_customer-input"
                        v-model="email_customer"
                        :state="emailState"
                        required
                    ></b-form-input>
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
                
          <b-modal
           v-model="deleteModal"
           title="Delete Item"
           @ok="delete_confirmation">
            <h4 style="text-align:center">Anda yakin untuk menghapus?</h4>
                <template #modal-footer="{ cancel, ok}">
                <b-button variant="no-otline" style="background-color:#3D322F; color:white" @click="cancel()">
                    Cancel
                </b-button>
                <b-button variant="no-outline" style="background-color:#A53A1D;color:white" @click="ok()">
                    Yes
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
            nama_customer:'',
            kontak_customer:'',
            email_customer:'',
            

            nameState:null,
            kontakState:null,
            kontak_feedback:'',
            emailState:null,
            email_feedback:'',

            deleteModal:false,
            delete_temp:null,
            id_customer:null,
            rows:[
                {id_customer:"",
                nama_customer:"",
                kontak_customer:"",
                email_customer:"",},
             ],
            fields:[
                 {key:'id_customer',
                 sortable:true},
                 {key: 'nama_customer',
                 sortable:true},
                 {key:'kontak_customer'},
                 {key:'email_customer'},
                 {key: 'action'},
            ],
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
          this.desc_modal='Tambah Customer'
          this.addModal=true;
          console.log(this.desc_modal)
      },checkFormValidity() {
        var error=0;
        if(this.nama_customer.length<1){
            this.nameState = false
            error=+1
        }
   
        if(this.kontak_customer==null){
          this.kontak_customer=''
        } else if(RegExp(phoneNumberRegex).test(this.kontak_customer)==false && this.kontak_customer.length>=1){
              
              this.kontak_feedback= 'Nomor yang dimasukan tidak valid'
              this.kontakState = false
              error=+1
          }

        if(this.email_customer==null){
          this.email_customer=' '
        }
        else if(!RegExp(emailRegex).test(this.email_customer) && this.email_customer.length>=1){
              
              this.email_feedback= 'Email yang dimasukan tidak valid'
              this.emailState = false
              error=+1
          }
    
        return error
      },
      resetModal() {
        this.nama_customer = ''
        this.kontak_customer=''
        this.email_customer=''
        this.kontakState=null
        this.emailState=null
        this.nameState = null
        this.kontakState=null
        this.emailState=null
      },
      handleOk(bvModalEvt) {
        bvModalEvt.preventDefault()
        this.handleSubmit()

        if(this.desc_modal=='Tambah Customer'){
            console.log(this.desc_modal)
        }
      },
      handleSubmit() {
        this.nameState = null
        this.kontakState=null
        this.emailState=null
   
        if (this.checkFormValidity()>0) {
          return
        }
        if(this.desc_modal=="Tambah Customer"){
          this.addData();
        }else{
          this.editData();
        }
        this.rows.push(this.nama_customer)
        this.$nextTick(() => {
          this.$bvModal.hide('modal-prevent-closing')
        })
      },
      editForm(item){
          this.desc_modal='Edit Customer'
          this.nama_customer=item.nama_customer
          this.kontak_customer=item.kontak_customer
          this.email_customer=item.email_customer
          this.id_customer=item.id_customer
          this.addModal=true     
      },
      delete_confirmation(){
          let item = new FormData
          var url = this.$api + '/sdel-customer/' + this.delete_temp.id_customer
        this.$http.post(url,item, {
            headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        }).then(response => {
            this.error_message= response.data.message;
            this.toastVar='success'
            this.title= 'Success'
            this.toast=true
            this.readData()
           }).catch(error => {
            this.error_message = error.response.data.message;
            this.toastVar='danger'
            this.title= 'Warning!!'
            this.toast=true
            })   
      },
      deleteItem(item){
          this.deleteModal=true
          this.delete_temp=item
      },
      readData(){
        var url = this.$api + '/customer'
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
            this.item.append('nama_customer',this.nama_customer);
            this.item.append('kontak_customer',this.kontak_customer);
            this.item.append('email_customer',this.email_customer);
        var url = this.$api + '/customer'
              this.load = true
              this.$http.post(url, this.item, {
                headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
              }).then(response => {
                  this.error_message= response.data.message;
                  this.toastVar='success'
                  this.title= 'Success'
                  this.toast=true
                  this.readData()
                }).catch(error => {
                  this.error_message = error.response.data.message;
                  this.toastVar='danger'
                  this.title= 'Warning!!'
                  this.toast=true
                  })          
              
              this.readData()
      },editData(){
        if(this.kontak_customer==null){
          this.kontak_customer=' '
        }
        if(this.email_customer==null){
          this.email_customer=' '
        }
        let newData = {
        nama_customer: this.nama_customer,
        kontak_customer: this.kontak_customer,
        email_customer: this.email_customer
        };
        var url = this.$api + "/update-customer/" + this.id_customer;
        this.load = true;
        this.$http
          .put(url, newData, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("access_token"),
            },
          })
          .then(response => {
            this.error_message= response.data.message;
            this.toastVar='success'
            this.title= 'Success'
            this.toast=true
            this.readData()
           }).catch(error => {
            this.error_message = error.response.data.message;
            this.toastVar='danger'
            this.title= 'Warning!!'
            this.toast=true
            });
          this.readData()
        }
      
   
    },
    mounted(){
      this.readData()
    },
    computed:{
    filteredRows() {
        return this.rows.filter(row => {
        const id_customer = row.id_customer?.toLowerCase();
        const nama_customer = row.nama_customer?.toLowerCase();
        const searchTerm = this.filter?.toLowerCase();

        return nama_customer?.includes(searchTerm) ||
            id_customer?.includes(searchTerm);
    });
    
  },

    }
}
</script>
<style scoped>
body{

  padding-left: 5%;
  padding-right: 5%;
  margin-top:7%; 
}

</style>
