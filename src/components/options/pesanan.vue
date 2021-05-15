<template>
    <body>
        <div>
        <b-button to="/home" size="md" variant="no-outline" style="margin-bottom:20px;background-color:#A53A1D;font-weight:bold;color:white"><b-icon icon="arrow-bar-left"></b-icon> Kembali</b-button>
          <b-card style="margin:0; box-shadow: 0 0.2rem 0.2rem rgba(0, 0, 0, 0.13)">
              <b-card-title style="font-weight:bold;color:#A53A1D ">
                  Data Pesanan
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
                <b-button variant="no-outline" style="background-color:#EC7309;color:white" class="iconEdit"  @click="toogleOpen(filteredRows.item);" v-b-modal.modal-center>
                <b-icon style="color:white" icon="info"></b-icon> Detail
                </b-button>
            </template>

            </b-table> 

          </b-card>
        </div>
                
         <b-modal v-model="dp_modal" size="lg" centered>
            <b-card-title>
                Detail Pesanan
            </b-card-title>
            <b-table
            style="text-align:center"
            :items="detail_pesanan"
            :fields="dp_fields">
            <template #cell(action)="detail_pesanan" >
                <b-button variant="no-outline" style="background-color:#EC7309;color:white" class="iconEdit"  @click="detail_pesanan" v-b-modal.modal-center>
                <b-icon style="color:white" icon="info"></b-icon> Ubah Status Pesanan
                </b-button>
            </template>
            </b-table>

         </b-modal>

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
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const minDate = new Date(today)

        return{
            page:5,
            currentPage:1,
            
            min: minDate,

            isBusy: false,
            filter:"",
          
            rows:[
             ],
            fields:[
                 {key:'id_pesanan',
                 sortable:true},
                 {key: 'no_meja',
                 sortable:true},
                 {key:'total_item'},
                 {key:'total_menu'},
                 {key:'tanggal_pesanan'},
                 {key:'Status Pesanan'},
                 {key: 'action'},
            ],
            dp_fields:[
                {key:'id_detil_pesanan'},
                {key:'id_menu'},
                {key:'jumlah_pesanan'},
                {key:'status_pesanan'},
                {key:'action'}
            ],
            toast:false,
            title:'',
            toastVar:'',
            error_message:'',
            detail_pesanan:[],
            dp_modal:false
            
        }
    },

    methods:{
        toogleOpen( item){
            
            this.readDetailPesanan(item.id_pesanan);
            this.dp_modal=true

        },
        count(){
            return this.filteredRows.length
        },
        readDetailPesanan(id_pesanan){
      
          var url = this.$api + '/detil-pesanan/'+id_pesanan
        this.$http.get(url, {
            headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        }).then(response => {
            this.detail_pesanan = response.data.data;
            console.log(response.data.data)
            console.log(this.detail_pesanan)
           })
      },
        toggleBusy() {
        this.isBusy = !this.isBusy
      },
      readData(){
        var url = this.$api + '/pesanan'
        this.$http.get(url, {
            headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        }).then(response => {
            this.rows = response.data.data
           })
      },
      
      
   
    },
    mounted(){
      this.readData()
    },
    computed:{
        
    filteredRows() {
        return this.rows.filter(row => {
        const id_pesanan = row.id_pesanan?.toLowerCase();
        const no_meja = row.no_meja?.toLowerCase();
        const searchTerm = this.filter?.toLowerCase();

        return id_pesanan?.includes(searchTerm) ||
            no_meja?.includes(searchTerm);
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
