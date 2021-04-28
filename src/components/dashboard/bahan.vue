<template>
    <body>
        <div>
          <b-card style="margin:0; margin-top:5%; box-shadow: 0 0.2rem 0.2rem rgba(0, 0, 0, 0.13)">
              <b-card-title style="font-weight:bold;color:#A53A1D ">
                  Data Bahan
              </b-card-title>
            <div class="d-flex justify-content-between align-items-center">
                    <input v-model="filter" type="text" class="form-control" style="width:40%"
                        placeholder="Search..." >
                      
                 <b-button @click="adding()" size="md" variant="no-outline" style="margin-bottom:5px;background-color:#EC7309;font-weight:bold;color:white"><b-icon icon="plus"></b-icon>Tambah Bahan</b-button>
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
                    label="Nama Bahan"
                    label-for="nama_bahan-input"
                    invalid-feedback="Nama Bahan tidak boleh kosong"
                    :state="nameState"
                    >
                    <b-form-input
                        id="nama_bahan-input"
                        v-model="nama_bahan"
                        :state="nameState"
                        required
                    ></b-form-input>
                    </b-form-group>
                    
                    <b-form-group
                    label="Harga Bahan"
                    label-for="harga_bahan-input"
                    :invalid-feedback="harga_feedback"
                    :state="hargaState"
                    >
                    <b-form-input
                        id="harga_bahan-input"
                        v-model="harga_bahan"
                        :state="hargaState"
                        required
                    ></b-form-input>
                    </b-form-group>

                     <b-form-group
                    label="Unit"
                    label-for="unit-input"
                    invalid-feedback="Unit tidak boleh kosong"
                    :state="unitState"
                    >
                    <b-form-input
                        id="unit-input"
                        v-model="unit"
                        :state="unitState"
                        required
                    ></b-form-input>
                    </b-form-group>

                    <b-form-group
                    label="Remaining Stock Bahan"
                    label-for="remaining_stock-input"
                    :invalid-feedback="remaining_stock_feedback"
                    :state="remaining_stockState"
                    >
                    <b-form-input
                        id="nama_bahan-input"
                        v-model="remaining_stock"
                        :state="remaining_stockState"
                        disabled
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
            nama_bahan:'',
            harga_bahan:'',
            unit:'',
            remaining_stock:'',
            id_item:null,
            

            nameState:null,
            hargaState:null,
            unitState:null,
            harga_feedback:'',

            remaining_stockState:null,
            remaining_stock_feedback:'',
          

            deleteModal:false,
            delete_temp:null,
            rows:[
                {id_bahan:"BHN-1",
                nama_bahan:"Squid",
                harga_bahan:"25000",
                unit:"gram",
                remaining_stock:"500"}
             ],
            fields:[
                 {key:'id_bahan',
                 sortable:true},
                 {key: 'nama_bahan',
                 sortable:true},
                 {key:'unit'},
                 {key:'remaining_stock'},
                 {key: 'action'},
            ],
            
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
          this.desc_modal='Tambah Bahan'
          this.addModal=true;
          console.log(this.nama_bahan)
          
      },checkFormValidity() {
        var error=0;
        if(this.nama_bahan.length<1){
            this.nameState = false
            error=+1
        }
        if(this.harga_bahan.length<1){
            this.hargaState = false
            this.harga_feedback= 'Harga tidak boleh kosong'
            error=+1
        } else if(!RegExp(numberOnlyRegex).test(this.harga_bahan)){
              
              this.harga_feedback= 'Harga haruslah angka'
              this.hargaState = false
              error=+1
          }

        if(this.unit.length<1){
              this.unitState = false
              error=+1
          } 

     
        return error
      },
      resetModal() {
        this.nama_bahan = ''
        this.harga_bahan= ''
        this.unit=''
        this.remaining_stock=''
        this.unitState=''
        this.remaining_stock_feedback=''
        this.nameState = null
        this.hargaState=null
        this.unitState=null
        this.remaining_stockState=null
      },
      handleOk(bvModalEvt) {
        bvModalEvt.preventDefault()
        this.handleSubmit()

        if(this.desc_modal=='Tambah Bahan'){
            console.log(this.desc_modal)
        }
      },
      handleSubmit() {
        this.nameState = null
        this.hargaState=null
        this.unitState=null
        this.remaining_stockState=null

   
        if (this.checkFormValidity()>0) {
          return
        }

        if(this.desc_modal=='Tambah Bahan'){
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
          this.nama_bahan=item.nama_bahan
          this.harga_bahan=item.harga_bahan
          this.unit=item.unit
          this.remaining_stock=item.remaining_stock
          this.id_item=item.id_bahan
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

              }).catch(error => {
                this.error_message = error.response.data.message;
              })          
              
              this.readData()
      },
      deleteItem(item){
          this.deleteModal=true
          this.delete_temp=item
      }
      ,readData(){
        var url = this.$api + '/bahan'
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
            this.item.append('nama_bahan',this.nama_bahan);
            this.item.append('harga_bahan',this.harga_bahan);
            this.item.append('unit',this.unit);
        var url = this.$api + '/bahan'
              this.$http.post(url, this.item, {
                headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
              }).then(response => {
                this.error_message = response.data.message;

              }).catch(error => {
                this.error_message = error.response.data.message;
              })          
              
              this.readData()
      },editData(){
          
        let newData = {
        nama_bahan: this.nama_bahan,
        unit:this.unit,
        harga_bahan:this.harga_bahan
        };
        var url = this.$api + "/update-bahan/" + this.id_item;
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
      
   
    },
    beforeMount(){
        this.readData()
    },
    computed:{

    filteredRows() {
        return this.rows.filter(row => {
        const id_bahan = row.id_bahan.toString().toLowerCase();
        const nama_bahan = row.nama_bahan.toLowerCase();
        const searchTerm = this.filter.toLowerCase();

        return nama_bahan.includes(searchTerm) ||
            id_bahan.includes(searchTerm);
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
