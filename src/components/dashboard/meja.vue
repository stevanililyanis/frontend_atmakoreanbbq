<template>
    <body>
        <div>
          <b-card style="margin:0; margin-top:5%; box-shadow: 0 0.2rem 0.2rem rgba(0, 0, 0, 0.13)">
              <b-card-title style="font-weight:bold;color:#A53A1D ">
                  Data Meja
              </b-card-title>
            <div class="d-flex justify-content-between align-items-center">
                    <input v-model="filter" type="text" class="form-control" style="width:40%"
                        placeholder="Search..." >
                      
                 <b-button @click="adding()" size="md" variant="no-outline" style="margin-bottom:5px;background-color:#EC7309;font-weight:bold;color:white"><b-icon icon="plus"></b-icon>Tambah Meja</b-button>
            </div>
                
           <b-table 
            id="my-table"
            :per-page="page"
            :current-page="currentPage"
            triped hover 
            :items="filteredRows" 
            :fields="fields"
             class="mt-3" outlined

            >
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
                <b-form-group v-if="desc_modal=='Edit Meja'"
                   label="Status Meja"
                    label-for="status-karyawan-input">
                   <b-input-group>
                    <b-input-group-prepend is-text>
                    <b-form-checkbox v-model="status_meja" switch class="mr-n2">
                    </b-form-checkbox>
                    </b-input-group-prepend>
                    <b-form-input disabled v-model="status_feedback"></b-form-input>
                </b-input-group>
               </b-form-group>
                <b-form-group
                    label="Nomor Meja"
                    label-for="nomor_meja-input"
                    invalid-feedback="Nomor meja tidak boleh kosong"
                    :state="noState"
                    >
                    <b-form-input
                        id="status_meja-input"
                        v-model="nomor_meja"
                        :state="noState"
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
export default {
    data(){
        return{
            page:5,
            currentPage: 1,
            isBusy: false,
            filter:'',
            addModal:false,
            desc_modal:'',
            status_meja:null,
            status_temp:null,
            nomor_meja:'',
            noState:null,
            deleteModal:false,
            delete_temp:null,
            id_item:'',
            rows:[
              {
                no_meja:'',
                status_meja:''
              }
             ],
            fields:[
                 {key:'no_meja',
                 sortable:true},
                 {key: 'status_meja',
                 sortable:true},
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
      adding(){
          this.desc_modal='Tambah Meja'
          this.addModal=true;
        
         
          
      },checkFormValidity() {
        const valid = this.$refs.form.checkValidity()
        this.noState = valid
        return valid
      },
      resetModal() {
        this.status_meja = null
        this.nomor_meja=''
        this.noState = null
      },
      handleOk(bvModalEvt) {
        bvModalEvt.preventDefault()
        this.handleSubmit()

        if(this.desc_modal=='Tambah Meja'){
            console.log(this.desc_modal)
        }
      },
      handleSubmit() {
        if (!this.checkFormValidity()) {
          return
        }

        if(this.desc_modal=='Tambah Meja')
            this.addData()
        else   
            this.editData()

        this.rows.push(this.status_meja)
        this.$nextTick(() => {
          this.$bvModal.hide('modal-prevent-closing')
        })
      },
      editForm(item){
          if(item.status_meja==1)
          {
              this.status_meja=true
              this.status_temp=1
          }else
            {
                this.status_temp=0
            }
          this.desc_modal='Edit Meja'
          this.nomor_meja=item.no_meja
          this.id_item=item.no_meja
          this.addModal=true     
      },
      delete_confirmation(){
       var url = this.$api + '/delete-meja/' + this.delete_temp.no_meja
        this.$http.delete(url, {
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
      },readData(){
        var url = this.$api + '/meja'
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
            this.item.append('no_meja',this.nomor_meja);
        var url = this.$api + '/meja'
              this.$http.post(url, this.item, {
                headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
              }).then(response => {
                
                this.readData()
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
              
              
              
              
      },editData(){
        
        if(this.status_meja==true)
        {
          this.status_temp=1
        }else
          this.status_temp=0
        let newData = {
        no_meja: this.nomor_meja,
        status_meja:this.status_temp
        };
        var url = this.$api + "/update-meja/" + this.id_item;
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
            })  
        },
   
      
   
    },
    beforeMount(){
        this.readData()
    },
    computed:{
    status_feedback(){
        if(this.status_meja==true){
            return 'Meja Aktif'
        }else
        {
            return 'Meja Tidak Aktif'
        }
    },
    filteredRows() {
        return this.rows.filter(row => {
        const no_meja = row.no_meja?.toString().toLowerCase();
        const searchTerm = this.filter?.toString().toLowerCase();

        return no_meja?.includes(searchTerm);
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
