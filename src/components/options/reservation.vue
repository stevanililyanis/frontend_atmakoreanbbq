<template>
    <body>
         <b-button to="/home" size="md" variant="no-outline" style="margin-bottom:20px;background-color:#A53A1D;font-weight:bold;color:white"><b-icon icon="arrow-bar-left"></b-icon> Kembali</b-button>
         

        
            <div >
                <h2 style="font-weight:bold;color:#A53A1D">RESERVASI ATMA KOREAN BBQ</h2>
            </div>
            <b-row>
                
                <b-col>
                    <b-form-group
                    label="Cari Reservasi"
                    label-for="cari_reservasi-input"
                    style="color:#A53A1D;font-weight:bold"
                    >
                   <input v-model="filter" type="text" class="form-control"
                        placeholder="Search..." >
                </b-form-group>
                </b-col>
                <b-col >
                    <b-form-group
                    label="Tanggal Reservasi"
                    label-for="tanggal_reservasi-input"
                    style="color:#A53A1D;font-weight:bold"
                    >
                      <b-form-datepicker string v-model="tanggal_reservasi"    locale="id"></b-form-datepicker>

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
                    <b-button block @click="readReservasi()">
                        Cari Reservasi
                    </b-button>
                    </b-form-group>
                    
                </b-col>
               
            </b-row>
            <b-row>
                <b-col
                class="col-md-2 col-sm-12"
                 v-for="item in filteredMeja"
                    :key="item.meja">
                    <b-card-group deck>
                        <b-card v-if="item.status_meja==0" 
                        :footer="item.id_reservasi +`  ||  `+ item.nama_customer"
                        bg-variant="success"  @click="addReservasi(item.no_meja)"  text-variant="white" class="text-center card1" style="box-shadow: 0 0.7rem 1rem rgba(0, 0, 0, 0.15)">
                            <b-card-text style="font-weight:bold;font-size:50px;">{{item.no_meja}}</b-card-text>
                        </b-card>
                        <b-card v-else bg-variant="danger"  
                        text-variant="white" class="text-center card1" 
                        style="box-shadow: 0 0.7rem 1rem rgba(0, 0, 0, 0.15);"
                        :footer="item.id_reservasi +`  ||  `+ item.nama_customer"
                        @click="gotoDetail(item)">
                                <b-card-text  style="font-weight:bold;font-size:50px;">{{item.no_meja}}</b-card-text >
                        </b-card>
                    </b-card-group>
                </b-col>
            </b-row>
        

        <b-modal v-model="addModal"
            id="modal-prevent-closing"
            ref="modal"
            :title="desc_modal"
            @hidden="resetModal"
            @ok="handleOk"
            centered>
              
                <form ref="form" @submit.stop.prevent="handleSubmit">
                    <b-badge variant="success" size="lg" style="margin-bottom:10px">
                     <h4 style="font-weight:bold;margin:5px"> NO. MEJA : {{no_meja_reservasi}} </h4>
                    </b-badge>
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
                        :placeholder="nama_cust_chosen"
                    ></b-form-input>
                      
                    <b-card v-show="showAutoload" style="box-shadow: 0 0.7rem 1rem rgba(0, 0, 0, 0.15)">
                          <b-table
                            per-page="5"
                            triped hover 
                            :items="filteredRows"
                            :fields="fields"
                            @row-clicked="setCustomer"
                            selectable
                            select-mode="single">
                            </b-table>
                    </b-card>
                        
            
                    </b-form-group>
                    <b-form-group
                    label="Tanggal Reservasi"
                    label-for="tanggal_reservasi-input"
                    invalid-feedback="Tanggal reservasi tidak boleh kosong"
                    
                    >
                      <b-form-datepicker disabled v-model="tanggal_reservasi_baru" :state="tanggalState" :min="min" locale="id"></b-form-datepicker>

                    </b-form-group>

                     <b-form-group
                    label="Sesi Reservasi"
                    label-for="sesi-reservasi"
                    >
                    <b-dropdown disabled v-model="jam" :text="jam"  style="width:100%" variant="outline-secondary">
                        <b-dropdown-item v-for="item in sesi" :key="item.sesi"  @click="chooseSesi(item)">{{item.jam}}</b-dropdown-item>
                     
                    </b-dropdown>
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

         
    </body>
</template>
<script>
import moment from 'moment'
export default {
    data(){
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const minDate = new Date(today)
        return{
            today:today,
            min:minDate,
            addModal:false,
            nama_customer:'',
            nama_cust_chosen:'',
            id_customer:'',
            tanggal_reservasi_baru:minDate,
            nameState:null,
            tanggalState:null,
            desc_modal:'',
            jam:'Pilih Sesi',
            session:null,
            autoload:false,
            no_meja_reservasi:'',
            filter:'',
            tanggal_reservasi:'',
            sesi:[{sesi:1, jam:'Lunch      |   11.00-16.00    '},
                    {sesi:2, jam:'Dinner    |    17.00-21.00    '}],
            meja:[{no_meja:'', status_meja:'', id_reservasi:'', nama_customer:''}],
            customers:[
                ],
            reservasi:[
            ],
            fields:[
                {key:'id_customer', 
                thStyle: {display: 'none'}},
                {key:'nama_customer', 
                thStyle: {display: 'none'}}
            ],
            
        }
    },methods:{
        chooseSesi(item){
          this.session=item.sesi
          this.jam=item.jam
      },
      addReservasi(item){
          this.desc_modal='Tambah Reservasi'
          this.no_meja_reservasi=item
          this.tanggal_reservasi_baru=this.tanggal_reservasi
          this.addModal=true
      },
         adding(){
          this.desc_modal='Tambah Reservasi'
          this.addModal=true;
          console.log(this.filteredRows)
          
      },checkFormValidity() {
        var error=0;
        if(this.nama_cust_chosen.length<1){
            this.nameState = false
            error=+1
        }

        if(this.tanggal_reservasi_baru.length<1){
            this.tanggalState = false
            error=+1
        }
    
        return error
      },
      resetModal() {
        this.nama_customer = ''
        this.tanggal_reservasi_baru=''
        this.nameState = null
        this.tanggalState=null
        this.nama_cust_chosen=''
      
      },
      handleOk(bvModalEvt) {
        bvModalEvt.preventDefault()
        this.handleSubmit()

        if(this.desc_modal=='Tambah Reservasi'){
            console.log(this.desc_modal)
        }
      },
      handleSubmit() {
        this.nameState = null
        this.tanggalState =null
   
        if (this.checkFormValidity()>0) {
          return
        }
        
        if(this.desc_modal=='Tambah Reservasi'){
            this.addData()
        }
        this.$nextTick(() => {
          this.$bvModal.hide('modal-prevent-closing')
        })
      },
      editForm(item){
          this.desc_modal='Edit Reservasi'
          this.nama_customer=item.nama_customer
          this.addModal=true     
      },
      delete_confirmation(){
          console.log(this.delete_temp)
      },
      deleteItem(item){
          this.deleteModal=true
          this.delete_temp=item
      },
      setCustomer(item){
          console.log(item)
          this.nama_cust_chosen=item.nama_customer
          this.nama_customer=''
          this.id_customer=item.id_customer
          this.autoload=false
          
      },
      readCustomer(){
          var url = this.$api + '/customer'
        this.$http.get(url, {
            headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        }).then(response => {
            this.customers = response.data.data
           })
      },
      readMeja(){
          var url = this.$api + '/meja'
        this.$http.get(url, {
            headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        }).then(response => {
            this.meja = response.data.data
            this.meja.forEach(element => {
                element.id_reservasi=''
                element.nama_customer=''
                
            });
           })
      },
      readReservasi(){
          this.meja.forEach(element => {
              element.status_meja=0
              element.id_reservasi=''
              element.nama_customer=''
          });
        var url = this.$api + '/reservasi-by-date/'+ this.tanggal_reservasi + '/' + this.session
        this.$http.get(url, {
            headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        }).then(response => {
            this.reservasi=response.data.data
            this.meja.forEach(meja => {
               this.reservasi.forEach(reservasi => {
                   if(meja.no_meja==reservasi.no_meja){
                       meja.status_meja=1
                       meja.id_reservasi=reservasi.id_reservasi
                       meja.id_customer=reservasi.id_customer
                       this.showCustomer(meja)
                   }
               });
               
           });
           })
       },
       showCustomer(item){
           this.customers.forEach(element => {
               if(element.id_customer==item.id_customer)
               {
                   item.nama_customer=element.nama_customer
               }
           });
       },
       addData(){
        this.item = new FormData;
            this.item.append('id_customer',this.id_customer);
            this.item.append('no_meja',this.no_meja_reservasi);
            this.item.append('tanggal_reservasi',this.tanggal_reservasi_baru)
            this.item.append('sesi_reservasi',this.session);
        var url = this.$api + '/reservasi'
              this.load = true
              this.$http.post(url, this.item, {
                headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
              }).then(response => {
                this.error_message = response.data.message;
                this.addModal=false
                this.readReservasi()

              }).catch(error => {
                this.error_message = error.response.data.message;
              })          
              
              this.Meja()
      },
      gotoDetail(item){
          localStorage.setItem('reservasiId',item.id_reservasi)
          this.$router.push({
                  name:"Reservation Detil"
                });
      }
    },
    beforeMount(){
        this.readCustomer()
        this.readMeja()
        var now = moment(String(this.today)).format('YYYY-MM-DD')
        this.tanggal_reservasi=now
        this.session=1
        this.jam='Lunch     |     11.00 - 17.00'
        this.readReservasi()
         
    },
    computed:{
        
        showAutoload(){
            if(this.nama_customer.length>3)
                {return true}
            else
                return false
        },
        filteredMeja() {
        return this.meja.filter(m => {
            return m.no_meja.toString().toLowerCase().includes(this.filter.toLowerCase()) ||
            m.id_reservasi.toLowerCase().includes(this.filter.toLowerCase())||
            m.nama_customer.toLowerCase().includes(this.filter.toLowerCase())
            });
        },
        filteredRows() {
        return this.customers.filter(row => {
        const id_customer = row.id_customer.toLowerCase();
        const nama_customer = row.nama_customer.toLowerCase();
        const searchTerm = this.nama_customer.toLowerCase();

        return nama_customer.includes(searchTerm) || id_customer.includes(searchTerm) 
            });
        }
    }
}
</script>
<style scoped>
body{

  padding-left: 5%;
  padding-right: 5%;
  margin-top:7%; 
}
.card1 {
  margin: 1rem;
  transition: 0.3s ease-in-out;
}
.card1:hover {
  transform: scale(1.05);
}
</style>