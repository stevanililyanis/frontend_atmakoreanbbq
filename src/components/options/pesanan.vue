<template>
    <body>
        <div>
        <b-button to="/home" size="md" variant="no-outline" style="margin-bottom:20px;background-color:#A53A1D;font-weight:bold;color:white"><b-icon icon="arrow-bar-left"></b-icon> Kembali</b-button>
          <b-card style="margin:0; box-shadow: 0 0.2rem 0.2rem rgba(0, 0, 0, 0.13)">
              <b-card-title style="font-weight:bold;color:#A53A1D ">
                  Data Pesanan
              </b-card-title>
                   
              <b-row>
                    <b-col>
                    <b-form-group
                    label="Cari Pesanan"
                    label-for="cari_pesanan-input"
                    style="color:#A53A1D;font-weight:bold">
                        <input v-model="filter" type="text" class="form-control" 
                        placeholder="Search..." >
                    </b-form-group>
                </b-col>
              
                 <b-col >
                    <b-form-group
                    label="Tanggal Pesanan"
                    label-for="tanggal_pesanan-input"
                    style="color:#A53A1D;font-weight:bold"
                    >
                      <b-form-datepicker string v-model="tanggal_pesanan"  locale="id"></b-form-datepicker>

                     </b-form-group>
                 </b-col>
                    <b-col>
                    <b-form-group
                    label="Sesi Reservasi"
                    label-for="sesi-reservasi"
                    style="color:#A53A1D;font-weight:bold"
                    >
                    <b-dropdown v-model="jam" :text="jam" offset="80" style="width:100%" variant="outline-secondary">
                        <b-dropdown-item v-for="item in sesi" :key="item.sesi"  @click="chooseSesi(item)">{{item.jam}}</b-dropdown-item>
                     
                    </b-dropdown>
                    </b-form-group>
                </b-col>
                <b-col cols="2">
                    <b-form-group
                    label="."
                    style="color:white;font-weight:bold"
                    >
                    <b-button block @click="readData()">
                        Cari Pesanan
                    </b-button>
                    </b-form-group>
                    
                </b-col>
              </b-row>
      
                
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
                <b-button variant="no-outline" style="background-color:#EC7309;color:white" class="iconEdit"  @click="toogleOpen(filteredRows.item);checkStatus(filteredRows.item)" v-b-modal.modal-center>
                <b-icon style="color:white" icon="info"></b-icon> Detail
                </b-button>
            </template>

            </b-table> 

          </b-card>
        </div >
                
         <b-modal v-model="dp_modal" size="xl" centered title="Detail Pesanan ">
             <div style="margin:10px">
            <b-card-title>
                
                <h2>
                    <b-badge variant ="success"> No. Meja: {{no_meja_modal}}
                    </b-badge>
                </h2>
                
            </b-card-title>
            
                
                <b-row>
                    <b-col>
                        Nama Customer
                    </b-col>
                    <b-col>
                        : {{nama_modal}}
                    </b-col>
                    <b-col>
                        Total Item
                    </b-col>
                    <b-col>
                        : {{total_item_modal}}
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        Waktu
                    </b-col>
                    <b-col>
                        : {{tanggal_pesanan_modal}} <b-badge v-if="sesi_modal==1" variant="warning">Lunch</b-badge> <b-badge v-else variant="warning">Dinner</b-badge>
                    </b-col>
                    <b-col>
                        Total Menu
                    </b-col>
                    <b-col>
                        : {{total_menu_modal}}
                    </b-col>
                </b-row>
            </div>
            <b-table
            :items="detail_pesanan"
            :fields="dp_fields">
            <template #cell(status_pesanan)="detail_pesanan">
                <p style="font-size:20px">
                <b-badge  v-if="detail_pesanan.item.status_pesanan=='QUEUE'" variant="danger">QUEUE</b-badge>
                <b-badge  v-else-if="detail_pesanan.item.status_pesanan=='COOK'" variant="info">COOK</b-badge>
                <b-badge  v-else-if="detail_pesanan.item.status_pesanan=='READY to SERVE'" variant="success">READY to SERVE</b-badge>
                <b-badge v-else variant="light">SERVED</b-badge>
                </p>
            </template>
            <template #cell(action)="detail_pesanan" >
             <!--   <b-dropdown v-if="jabatan.nama_jabatan=='Operasional Manager'||(jabatan.nama_jabatan=='Waiter' && detail_pesanan.item=='READY to SERVE')||( jabatan.nama_jabatan=='Kasir' && detail_pesanan.item=='READY to SERVE')||(jabatan.nama_jabatan=='Chef' && detail_pesanan.item!='SERVED')" 
                v-model="cook" :text="detail_pesanan.item.status_pesanan" variant="warning" style="width:200px">-->
                <b-dropdown v-if="detail_pesanan.item.status_pesanan!='SERVED'" 
                v-model="cook" :text="detail_pesanan.item.status_pesanan" variant="warning" style="width:200px">
                    <div v-for="item in cook" :key="item">
                     <b-dropdown-item  v-if="(jabatan.nama_jabatan=='Waiter'||jabatan.nama_jabatan=='Kasir') && (item=='QUEUE' || item =='READY to SERVE'||item=='COOK')" disabled>{{item}}</b-dropdown-item>
                    <b-dropdown-item  v-else-if="(jabatan.nama_jabatan=='Waiter'||jabatan.nama_jabatan=='Kasir') && (item=='SERVED') && detail_pesanan.item.status_pesanan!='READY to SERVE'" disabled>{{item}}</b-dropdown-item>
                     <b-dropdown-item  v-else-if="jabatan.nama_jabatan=='Chef' && (item=='SERVED')" @click="setStatus(item); editStatus(detail_pesanan.item); " disabled>{{item}}</b-dropdown-item>
                     <b-dropdown-item  v-else @click="setStatus(item); editStatus(detail_pesanan.item)">{{item}}</b-dropdown-item>
                    </div>
                    </b-dropdown>
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
import moment from 'moment'
export default {
    data(){
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const minDate = moment(String(new Date(today))).format('YYYY-MM-DD')
    

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
                 {key:'nama_customer',
                  sortable:true},
                 {key: 'no_meja',
                 sortable:true},
                 {key:'total_item'},
                 {key:'total_menu'},
                 {key:'tanggal_pesanan'},
                 {key:'status_pesanan'},
                 {key: 'action'},
            ],
            dp_fields:[
                {key:'id_detil_pesanan'},
                {key:'id_menu'},
                {key:'nama_menu'},
                {key:'jumlah_pesanan'},
                {key:'status_pesanan'},
                {key:'action'}
            ],
            toast:false,
            title:'',
            toastVar:'',
            error_message:'',
            detail_pesanan:[],
            nama_modal:'',
            no_meja_modal:'',
            tanggal_pesanan_modal:'',
            sesi_modal:'',
            total_item_modal:'',
            total_menu_modal:'',
            dp_modal:false,
            tanggal_pesanan: minDate,
            sesi:[{sesi:1, jam:'Lunch      |   11.00-16.00    '},
                    {sesi:2, jam:'Dinner    |    17.00-21.00    '}],
            jam:'Lunch      |   11.00-16.00    ',
            session:'1',
            cook:[
                "QUEUE",
                "COOK",
                "READY to SERVE",
                "SERVED"
            ],
            status:'',
            jabatan:''
            
        }
    },

    methods:{
        setStatus(item){
            this.status = item;
        },
        editStatus(item){
            let newData = {
            status_pesanan : this.status
            };
            var url = this.$api + "/update-detil-pesanan/" + item.id_detil_pesanan;
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
                this.readDetailPesanan(item.id_pesanan)
            }).catch(error => {
                this.error_message = error.response.data.message;
                this.toastVar='danger'
                this.title= 'Warning!!'
                this.toast=true
                });
            this.readData()
        },
          chooseSesi(item){
          this.session=item.sesi
          this.jam=item.jam
      },
        toogleOpen( item){
            
            this.readDetailPesanan(item.id_pesanan);
            this.nama_modal=item.nama_customer
            this.no_meja_modal=item.no_meja
            this.tanggal_pesanan_modal=item.tanggal_pesanan
            this.sesi_modal=item.sesi_reservasi
            this.total_item_modal=item.total_item
            this.total_menu_modal=item.total_menu,
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
            console.log(this.jabatan)
           })
      },
        toggleBusy() {
        this.isBusy = !this.isBusy
      },
      readData(){
        var url = this.$api + '/pesanan/' + this.tanggal_pesanan + '/' + this.session
        this.$http.get(url, {
            headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        }).then(response => {
            this.rows = response.data.data
           })
      },
      readJabatan(){
        var url = this.$api + '/jabatan/'+ localStorage.getItem('roleId')
        this.$http.get(url, {
            headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        }).then(response => {
            this.jabatan = response.data.data
           })
      },
      checkStatus(item){
        var url = this.$api + '/check-status/'+ item.id_pesanan
        this.$http.get(url, {
            headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        }).then(response => {
            this.jabatan = response.data.data
            })
        },
      
   
    },
    beforeMount(){
      this.readData()
      this.readJabatan()
      
    },
    computed:{
    
      
    filteredRows() {
        return this.rows.filter(row => {
        const id_pesanan = row.id_pesanan?.toLowerCase();
        const no_meja = row.no_meja?.toString().toLowerCase();
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
