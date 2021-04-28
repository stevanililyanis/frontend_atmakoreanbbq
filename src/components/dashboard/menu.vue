<template>
    <body>
        <div>
          <b-card style="margin:0; margin-top:5%; box-shadow: 0 0.2rem 0.2rem rgba(0, 0, 0, 0.13)">
              <b-card-title style="font-weight:bold;color:#A53A1D ">
                  Data Menu
              </b-card-title>
            <div class="d-flex justify-content-between align-items-center">
                    <input v-model="filter" type="text" class="form-control" style="width:40%"
                        placeholder="Search..." >
                      
                 <b-button @click="adding()" size="md" variant="no-outline" style="margin-bottom:5px;background-color:#EC7309;font-weight:bold;color:white"><b-icon icon="plus"></b-icon>Tambah Menu</b-button>
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

            <template #cell(ketersediaan)="filteredRows">
                <b-badge v-if="filteredRows.item.ketersediaan==1" variant="success">Tersedia</b-badge>
                <b-badge v-else variant="secondary">Tidak Tersedia</b-badge>
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
           
                     <b-form-group v-if="desc_modal=='Edit Menu'"
                        label="Ketersediaan Menu"
                        label-for="ketersediaan-input">
                        <b-input-group>
                        <b-input-group-prepend is-text>
                            <b-form-checkbox v-model="ketersediaan" switch class="mr-n2">
                            </b-form-checkbox>
                            </b-input-group-prepend>
                            <b-form-input disabled v-model="status_ketersediaan" ></b-form-input>
                        </b-input-group>
                    </b-form-group>
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
                    label="Nama Menu"
                    label-for="nama_menu-input"
                    invalid-feedback="Nama menu tidak boleh kosong"
                    :state="nameState"
                    >
                    <b-form-input
                        id="nama_menu-input"
                        v-model="nama_menu"
                        :state="nameState"
                        required
                    ></b-form-input>
                    </b-form-group>
                    
                    <b-form-group
                    label="Deskripsi Menu"
                    label-for="deskripsi_menu-input"
                    invalid-feedback="Deskripsi menu tidak boleh kosong"
                    :state="deskripsiState"
                    >
                    <b-form-textarea
                        id="deskripsi_menu-input"
                        v-model="deskripsi_menu"
                        :state="deskripsiState"
                        required
                    ></b-form-textarea>
                    </b-form-group>

                    <b-form-group
                    label="Gambar Menu"
                    label-for="gambar_menu-input"
                    >
                    <b-form-file
                    v-model="gambar"
                    placeholder="Pilih atau drop gambar menu"
                    drop-placeholder="Drop gambar menu disini"
                    ></b-form-file>
                    </b-form-group>

                    <b-form-group
                    label="Harga Menu"
                    label-for="nama_menu-input"
                    :invalid-feedback="harga_feedback"
                    :state="hargaState"
                    >
                    <b-form-input
                        id="harga_menu-input"
                        v-model="harga_menu"
                        :state="hargaState"
                        required
                    ></b-form-input>
                    </b-form-group>

                     <b-form-group
                    label="Serving Size"
                    label-for="serving_size-input"
                    :invalid-feedback="serving_feedback"
                    :state="servingState"
                    >
                    <b-form-input
                        id="serving_size-input"
                        v-model="serving_size"
                        :state="servingState"
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
        return{
            page:5,
            currentPage:1,

            isBusy: false,
            filter:"",
            addModal:false,
            desc_modal:'',
            nama_menu:'',
            deskripsi_menu:'',
            harga_menu:'',
            gambar:null,
            serving_size:'',
            unit:'',
            bahan:'Pilih Bahan',
            id_bahan:'',
            ketersediaan:true,
            id_item:null,
            
            nameState:null,
            deskripsiState:null,
            hargaState:null,
            servingState:null,
            unitState:null,
            bahanState:null,
            bahanVariant:'light',

            serving_feedback:'',
            harga_feedback:'',

            deleteModal:false,
            delete_temp:null,
            rows:[
             ],
            fields:[
                 {key:'id_menu',
                 sortable:true},
                 {key: 'nama_menu',
                 sortable:true},
                 {key:'harga_menu'},
                 {key:'ketersediaan'},
                 {key: 'action'},
            ],
            bahans:[
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
          this.desc_modal='Tambah Menu'
          this.addModal=true;
          
      },checkFormValidity() {
        var error=0;
        if(this.nama_menu.length<1){
            this.nameState = false
            error=+1
        }
        if(this.deskripsi_menu.length<1){
            this.deskripsiState = false
            error=+1
        }
        if(this.harga_menu.length<1){
            this.hargaState = false
            this.harga_feedback='Harga menu tidak boleh kosong'
            error=+1
        }else if(!RegExp(numberOnlyRegex).test(this.harga_menu)){
            this.hargaState=false
            this.harga_feedback='Harga menu haruslah angka'
            error=+1
        }

        if(this.serving_size.length<1){
            this.servingState = false
            this.serving_feedback='Serving size tidak boleh kosong'
            error=+1
        }else if(!RegExp(numberOnlyRegex).test(this.serving_size)){
            this.servingState=false
            this.serving_feedback='Serving size haruslah angka'
            error=+1
        }

        if(this.unit.length<1){
            this.unitState = false
            error=+1
        }

        if(this.bahan=='Pilih Bahan'){
            this.bahanState = false
            this.bahanVariant='outline-danger'
            error=+1
        }

        return error
      },
      resetModal() {
        this.nama_menu = ''
        this.deskripsi_menu= ''
        this.harga_menu=''
        this.gambar=''
        this.serving_size=''
        this.unit=''
        this.bahan='Pilih Bahan'
        this.nameState = null
        this.deskripsiState=null
        this.hargaState=null
        this.servingState=null
        this.unitState=null
        this.bahanState=null
        this.harga_feedback=''
        this.serving_feedback=''
        this.bahanVariant='light'

      },
      handleOk(bvModalEvt) {
        bvModalEvt.preventDefault()
        this.handleSubmit()

        if(this.desc_modal=='Tambah Menu'){
            console.log(this.desc_modal)
        }
      },
      handleSubmit() {
        this.nameState = null
        this.deskripsiState=null
        this.hargaState=null
        this.servingState=null
        this.unitState=null
        this.bahanState=null
        this.bahanVariant='light'
   
        if (this.checkFormValidity()>0) {
          return
        }

        if(this.desc_modal=='Tambah Menu'){
            this.addData()
        }else{
            
            this.editData()
        }

        this.$nextTick(() => {
          this.$bvModal.hide('modal-prevent-closing')
        })
      },
      editForm(item){
          this.desc_modal='Edit Menu'
          this.nama_menu=item.nama_menu
          this.deskripsi_menu=item.deskripsi_menu
          this.gambar=item.gambar
          this.harga_menu=item.harga_menu
          this.serving_size=item.serving_size
          this.unit=item.unit
          this.searchBahan(item.id_bahan)
          this.id_item=item.id_menu
          
          if(!item.ketersediaan==1){
              this.ketersediaan=false
          }

          this.addModal=true     
      },
      delete_confirmation(){
          this.item= new FormData
           var url = this.$api + '/sdel-menu/' + this.delete_temp.id_menu
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
      },
      deleteItem(item){
          this.deleteModal=true
          this.delete_temp=item
      },
      chooseBahan(item){
          this.bahan=item.nama_bahan
          this.id_bahan=item.id_bahan
      },
      searchBahan(id_bahan){
          this.bahans.forEach(element => {
              if(element.id_bahan==id_bahan){
                  this.id_bahan=id_bahan
                  this.bahan=element.nama_bahan
              }
              
          });
      },readData(){
        var url = this.$api + '/menu'
        this.$http.get(url, {
            headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        }).then(response => {
            this.rows = response.data.data
           })
      },readBahan(){
        var url = this.$api + '/bahan'
        this.$http.get(url, {
            headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        }).then(response => {
            this.bahans = response.data.data
           })
      },
      addData(){
        this.item = new FormData;
            this.item.append('nama_menu',this.nama_menu);
            this.item.append('deskripsi_menu',this.deskripsi_menu);
            this.item.append('unit',this.unit);
            this.item.append('serving_size',this.serving_size);
            this.item.append('harga_menu',this.harga_menu);
            this.item.append('id_bahan',this.id_bahan);
            this.item.append('gambar',this.gambar);
        var url = this.$api + '/menu'
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
        let available=null
        if(this.ketersediaan==false){
            available=0;
        }else  
            available=1

        let newData = {
        nama_menu: this.nama_menu,
        deskripsi_menu:this.deskripsi_menu,
        unit:this.unit,
        harga_menu:this.harga_menu,
        gambar:this.gambar,
        serving_size:this.serving_size,
        id_bahan:this.id_bahan,
        ketersediaan:available
        };
        var url = this.$api + "/update-menu/" + this.id_item;
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
   
    },
    beforeMount(){
        this.readData()
        this.readBahan()
        
    },
    computed:{
        status_ketersediaan(){
        if(this.ketersediaan==true){
            return 'Tersedia'
        }else
            return 'Tidak Tersedia'
    },
    filteredRows() {
        return this.rows.filter(row => {
        const id_menu = row.id_menu.toString().toLowerCase();
        const nama_menu = row.nama_menu.toLowerCase();
        const searchTerm = this.filter.toLowerCase();

        return nama_menu.includes(searchTerm) ||
            id_menu.includes(searchTerm);
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
