<template>
    <body>
        <div>
          <b-card style="margin:0; margin-top:5%; box-shadow: 0 0.2rem 0.2rem rgba(0, 0, 0, 0.13)">
              <b-card-title style="font-weight:bold;color:#A53A1D ">
                  Data Riwayat Keluar & Masuk Bahan
              </b-card-title>
            <div class="d-flex justify-content-between align-items-center">
                    <input v-model="filter" type="text" class="form-control" style="width:40%"
                        placeholder="Search..." >
                      
                 <b-button @click="adding()" size="md" variant="no-outline" style="margin-bottom:5px;background-color:#EC7309;font-weight:bold;color:white"><b-icon icon="plus"></b-icon>Tambah Riwayat Bahan</b-button>
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
                    label="Bahan dasar"
                    label-for="bahan-input"
                    invalid-feedback="Nama bahan tidak boleh kosong"
                    :state="bahanState"
                    >
                    <b-dropdown v-model="bahan" :text="bahan" :variant="bahanVariant">
                        <b-dropdown-item v-for="item in bahans" :key="item.id_bahan" @click="chooseBahan(item)">{{item.nama_bahan}}</b-dropdown-item>
                     
                    </b-dropdown>
                    </b-form-group>

                    <b-form-group
                    label="Tipe Riwayat"
                    label-for="tipe-input"
                    invalid-feedback="Tipe riwayat tidak boleh kosong"
                    :state="riwayatState"
                    >
                    <b-dropdown v-model="tipe_riwayat" :text="text_riwayat" :variant="riwayatVariant">
                        <b-dropdown-item v-for="item in tipe_riwayat" :key="item" @click="chooseRiwayat(item)" >{{item}}</b-dropdown-item>
                     
                    </b-dropdown>
                    </b-form-group>
                    <b-form-group
                    label="Stock Bahan"
                    label-for="_stock-input"
                    :invalid-feedback="stock_feedback"
                    :state="stockState"
                    >
                    <b-form-input
                        id="nama_bahan-input"
                        v-model="stock"
                        :state="stockState"
                    ></b-form-input>
                    </b-form-group>

                    <b-form-group
                    v-show="incoming"
                    label="Harga Bahan"
                    label-for="harga_bahan-input"
                    :invalid-feedback="harga_feedback"
                    :state="hargaState"
                    >
                    <b-form-input
                        id="harga_bahan-input"
                        v-model="harga_bahan"
                        :state="hargaState"
                    ></b-form-input>
                    </b-form-group>      

                    <b-form-group
                    label="Tanggal Riwayat Bahan"
                    label-for="tanggal_riwayat-input"
                    invalid-feedback="Tanggal tidak boleh kosong"
                    >
                      <b-form-datepicker v-model="tanggal" :state="tanggalState"  locale="id"></b-form-datepicker>

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
           centered
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
import {numberOnlyRegex} from '@/validation/regex'
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
            harga_bahan:'',
            stock:'',
            id_item:null,
            

         
            hargaState:null,
            harga_feedback:'',

            stockState:null,
            stock_feedback:'',
            

            deleteModal:false,
            delete_temp:null,
            rows:[

             ],
            fields:[
                 {key:'id_history',
                 sortable:true},
                 {key: 'id_bahan',
                 sortable:true},
                 {key:'tipe_stock'},
                 {key:'stock'},
                 {key:'tanggal',
                 sortable:true},
                 {key: 'action'},
            ],
            text_riwayat:'Pilih Riwayat',
            riwayatState:null,
            riwayatVariant:'Light',
            tipe_riwayat:[
                'Incoming',
                'Waste'
            ],
            bahans:[],
            bahan:'Pilih Bahan',
            id_bahan:'',
            bahanState:null,
            bahanVariant:'Light',
            tanggal:'',
            tanggalState:null,
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
          this.desc_modal='Tambah Riwayat'
          this.addModal=true;
          
      },checkFormValidity() {
        var error=0;
      
        if(!RegExp(numberOnlyRegex).test(this.harga_bahan)&&this.tipe_riwayat=='Incoming'){
              
              this.harga_feedback= 'Harga haruslah angka'
              this.hargaState = false
              error=+1
          }
        

        if(this.stock.length<1){
            this.stockState = false
            this.stock_feedback= 'Stock tidak boleh kosong'
            error=+1
        } else if(!RegExp(numberOnlyRegex).test(this.stock)){
              
              this.stock_feedback= 'Stock haruslah angka'
              this.stockState = false
              error=+1
          }

        if(this.bahan=='Pilih Bahan'){
            this.bahanState = false
            this.bahanVariant='outline-danger'
            error=+1
        }
        if(this.text_riwayat=='Pilih Riwayat'){
            this.riwayatState = false
            this.riwayatVariant='outline-danger'
            error=+1
        }

        if(this.tanggal.length<1){
            this.tanggalState = false
            error=+1
        }
     
        return error
      },
      resetModal() {
    
        this.harga_bahan= ''
        this.stock=''
        this.unitState=''
        this.stock_feedback=''
        this.tanggal=''
        this.tanggalState=null
      
        this.hargaState=null
        this.stockState=null
        this.id_bahan=''
        this.bahan='Pilih Bahan'
        this.bahanState=null
        this.bahanVariant='light'

        this.text_riwayat='Pilih Riwayat'
        this.riwayatState=null
        this.riwayatVariant='light'
      },
      handleOk(bvModalEvt) {
        bvModalEvt.preventDefault()
        this.handleSubmit()

        if(this.desc_modal=='Tambah Riwayat'){
            console.log(this.desc_modal)
        }
      },
      handleSubmit() {

        this.hargaState=null
        this.stockState=null
        this.bahanState=null
        this.bahanVariant='light'
        this.riwayatState=null
        this.riwayatVariant='light'
        this.tanggalState=null

   
        if (this.checkFormValidity()>0) {
          return
        }

        if(this.desc_modal=='Tambah Riwayat'){
            this.addData()
        }else{
            this.editData()
        }
      
        this.$nextTick(() => {
          this.$bvModal.hide('modal-prevent-closing')
        })
      },
      editForm(item){
          this.desc_modal='Edit Bahan'
          this.tanggal=item.tanggal
          this.harga_bahan=item.harga_bahan
          this.stock=item.stock
          this.id_item=item.id_history
          this.bahans.forEach(element => {
            if(element.id_bahan==item.id_bahan)
                this.chooseBahan(element) 
          });

          this.text_riwayat=item.tipe_stock
          this.addModal=true     
      },
      delete_confirmation(){
           this.item= new FormData
           var url = this.$api + '/sdel-bahan/' + this.delete_temp.id_bahan
              this.$http.post(url, this.item, {
                headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
              }).then(response => {
                this.error_message = response.data.message;
                this.toastVar="success"
                this.title="Success!!"
                this.toast=true

              }).catch(error => {
                this.error_message = error.response.data.message;
                this.toastVar='danger'
                this.title= 'Warning!!'
                this.toast=true
              })          
              
              this.readData()
      },
      deleteItem(item){
          this.deleteModal=true
          this.delete_temp=item
      }
      ,readData(){
        var url = this.$api + '/history'
        this.$http.get(url, {
            headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        }).then(response => {
            this.rows = response.data.data
            console.log(this.rows)
           })
      },
      addData(){

        this.item = new FormData;
            this.item.append('id_bahan',this.id_bahan);
            this.item.append('harga_bahan',this.harga_bahan);
            this.item.append('tipe_stock',this.text_riwayat);
            this.item.append('stock',this.stock);
            this.item.append('tanggal',this.tanggal);
        var url = this.$api + '/history'
              this.$http.post(url, this.item, {
                headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
              }).then(response => {
                this.error_message = response.data.message;
                this.toastVar="success"
                this.title="Success!!"
                this.toast=true

              }).catch(error => {
                this.error_message = error.response.data.message;
                this.toastVar="danger"
                this.title="Warning!!"
                this.toast=true
              })          
              
              this.readData()
      },editData(){
          

        let newData = {
        id_bahan:this.id_bahan,
        tipe_stock:this.text_riwayat,
        tanggal : this.tanggal,
        stock: this.stock,
        harga_bahan:this.harga_bahan
        };
        var url = this.$api + "/update-history/" + this.id_item;
        this.load = true;
        this.$http
          .put(url, newData, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("access_token"),
            },
          })
          .then((response) => {
            this.error_message = response.data.message;
            this.toastVar="success"
            this.title="Success!!"
            this.toast=true
          })
          .catch((error) => {
            this.error_message = error.response.data.message;
            this.toastVar="danger"
            this.title="Warning!!"
            this.toast=true

          });
          this.readData()
        },
      readBahan(){
        var url = this.$api + '/bahan'
        this.$http.get(url, {
            headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        }).then(response => {
            this.bahans = response.data.data
           })
      },
      chooseBahan(item){
          this.bahan=item.nama_bahan
          this.id_bahan=item.id_bahan
      },
      chooseRiwayat(item){
          this.text_riwayat=item
      },
      searchBahan(id_bahan){
          this.bahans.forEach(element => {
              if(element.id_bahan==id_bahan){
                  this.id_bahan=id_bahan
                  this.bahan=element.nama_bahan
              }
              
          });
      }
      
   
    },
    beforeMount(){
        this.readData()
        this.readBahan()
    },
    computed:{
    incoming(){
        if(this.text_riwayat=='Incoming')
            return true
        else   
            return false
    },
    filteredRows() {
        return this.rows.filter(row => {
        const id_bahan = row.id_bahan?.toString().toLowerCase();
        const id_history = row.id_history?.toLowerCase();
        const searchTerm = this.filter?.toLowerCase();

        return id_bahan?.includes(searchTerm) ||
            id_history?.includes(searchTerm);
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
