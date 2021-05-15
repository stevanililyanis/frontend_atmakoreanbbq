<template>
    <body>
         <b-button to="/reservation" size="md" variant="no-outline" style="margin-bottom:20px;background-color:#A53A1D;font-weight:bold;color:white"><b-icon icon="arrow-bar-left"></b-icon> Kembali ke Daftar Reservasi</b-button>
         

        
            <div >
                <h2 style="font-weight:bold;color:#A53A1D">RESERVASI ATMA KOREAN BBQ</h2>
            </div>

            <b-card style="margin-top:20px;background-color:white;box-shadow: 0 0.1rem 0.5rem rgba(0, 0, 0, 0.15);padding-left:25px ">
              <b-row>
                <b-col>
                  <p>ID Reservasi</p>
                  <p>Tanggal Reservasi</p>
                  <p>Sesi Reservasi</p>
                  <p>Nama Customer</p>
                  <p>Nomor Meja</p>
                </b-col>
                <b-col cols="8">
                  <p>{{reservasi.id_reservasi}}</p>
                  <p>{{res_date}} </p>
                  <p><b-badge style="padding: 7px" variant="warning">{{deskripsi_sesi}}</b-badge></p>
                  <p>{{nama_customer}}</p>
                  <p>{{reservasi.no_meja}}</p>
                </b-col>
                <b-col>
                  <b-button block @click="editForm()"> <b-icon icon="pencil" > </b-icon> Ubah Reservasi</b-button>
                  <b-button block @click="deleteItem()" style="margin-top:10px" variant="danger" ><b-icon icon="trash"> </b-icon> Hapus Reservasi</b-button>
                  <b-button @click="generateQR()" style="margin-top:10px;height:100px; background-color:#EC7309; color:white" variant="no-outline"  block> <img src="../../assets/qr-code.png" style="height:45px"><br> Generate QR Code</b-button>
                </b-col>
              </b-row>
            </b-card>

            <b-modal 
            v-model="editModal"
            id="modal-prevent-closing"
            ref="modal"
            title="Ubah Reservasi"
            @hidden="resetModal"
            @ok="handleOk"
            centered>
              
                <form ref="form" @submit.stop.prevent="handleSubmit">

                    <b-form-group
                    label="No Meja"
                    label-for="No Meja">
                     <b-dropdown v-model="no_meja" variant="success" size="lg" :text="no_meja_selected"  >
                        <div  v-for="item in filteredMeja" :key="item.no_meja">
                        <b-dropdown-item v-if="item.status_meja==0"   @click="chooseMeja(item)">{{item.no_meja}}</b-dropdown-item>
                        <b-dropdown-item v-else disabled  @click="chooseMeja(item)">{{item.no_meja}}</b-dropdown-item>

                        </div>
                    </b-dropdown>
                      
                    </b-form-group>
                    <b-form-group
                    label="Nama Customer"
                    label-for="nama_customer-input"
                    invalid-feedback="Nama customer tidak boleh kosong"
                    :state="nameState"
                    >
                    <b-form-input
                        id="nama_customer-input"
                        v-model="namaCustomer"
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
                      <b-form-datepicker @click="readReservasi" v-model="tanggal_reservasi_baru" :state="tanggalState" :min="min" locale="id"></b-form-datepicker>

                    </b-form-group>

                     <b-form-group
                    label="Sesi Reservasi"
                    label-for="sesi-reservasi"
                    >
                    <b-dropdown v-model="jam" :text="jam" style="width:100%" variant="outline-secondary">
                        <b-dropdown-item v-for="item in sesi" :key="item.sesi"  @click="chooseSesi(item)">{{item.jam}}</b-dropdown-item>
                     
                    </b-dropdown>
                    </b-form-group>
                </form>
              <template #modal-footer="{ cancel, ok}">
                <b-button variant="no-otline" style="background-color:#3D322F; color:white" @click="cancel()">
                    Cancel
                </b-button>
                <b-button variant="no-outline" style="background-color:#A53A1D;color:white" @click="ok()">
                    Ubah Reservasi
                </b-button>
            </template>
          </b-modal>
          <b-toast v-model="toast" :title="title" :variant="toastVar" toaster="b-toaster-bottom-center">
          {{error_message}}
        </b-toast >
         <b-modal
           v-model="deleteModal"
           title="Delete Item"
           @ok="delete_confirmation"
           centered>
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
            
          <b-modal 
          header-class="header-class"
          v-model="qrModal" 
          @ok="cetak_qr"
          centered>
          <template #modal-header >
               <h4> QR Code</h4>
                </template>
            <b-row class="justify-content-center">
              <h3 style="margin-top:5px; margin-bottom:20px"><b-badge variant="warning">{{pesanan.id_pesanan}}</b-badge></h3>
            </b-row>
            <b-row class="justify-content-center">
              
                <b-card border-variant="warning">
                  <div id="qr_image">
                    <qr-code :text="qr_url"></qr-code>
                  </div>
                </b-card>
              
            </b-row>
            <b-row style="margin-top:25px" class="justify-content-center">
              Cetak QR Code dan Scan melalui aplikasi.
            </b-row>

             <template #modal-footer="{ cancel, ok}">
                <b-button variant="no-outline" style="background-color:#3D322F;color:white" @click="cancel()">
                    Close
                </b-button>
                <b-button variant="no-outline" style="background-color:#A53A1D;color:white" @click="ok()">
                   <b-icon icon="printer"></b-icon> Cetak
                </b-button>
                </template>
          </b-modal>
    </body>
</template>

<script>

import moment from 'moment'
import VueQRCodeComponent from 'vue-qrcode-component'
import { jsPDF } from "jspdf"
export default {
  data(){
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const minDate = new Date(today)
    return{
      qr_url:'https://atmakoreanbbq.me',
      qrModal:false,
      min:minDate,
      reservasi:[],
      customers:[],
      nama_customer:'',
      namaCustomer:'',
      meja:[{no_meja:'', status_meja:'', id_reservasi:'', nama_customer:''}],
      no_meja:'',
      editModal:false,
      tanggal_reservasi:'',
      sesi_reservasi:'',
      id_customer:'',
      tanggal_reservasi_baru:'',
      deskripsi_sesi:'',
      jam:'',
       sesi:[{sesi:1, jam:'Lunch      |   11.00-16.00    '},
                    {sesi:2, jam:'Dinner    |    17.00-21.00    '}],

      nama_cust_chosen:'',
      nameState:null,
      tanggalState:null,
      fields:[
                {key:'id_customer', 
                thStyle: {display: 'none'}},
                {key:'nama_customer', 
                thStyle: {display: 'none'}}
            ],

      toast:false,
      title:'',
      toastVar:'',
      error_message:'',
      reservasi_date:[],
      no_meja_selected:'',
      deleteModal:false,

      karyawan:[],
      pesanan:[],
    }
  },
  component:{
    VueQRCodeComponent
  },
  methods:{
    cetak_qr(){
      const qrcode = document.getElementById('qr_image');
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds() )
      const date = new Date(today)
      let tanggal_cetak = 'Printed '+ moment(String(date)).format('MMMM DD, YYYY h:mm:ss A')
      let karyawan = 'Printed by ' + this.karyawan.nama_karyawan;
      const doc = new jsPDF({
      orientation: "potrait",
      unit: "in",
      format: [5.5, 4]
    });

    let base64Image = this.getBase64Image(qrcode.firstChild.firstChild);
    
    doc.addImage(base64Image, 'JPG', 1.25, 2, 1.5, 1.5);
    doc.setFontSize(10);
    doc.text(tanggal_cetak, 0.95,4);
    doc.text(karyawan, 1.97,4.3, 'center');
    doc.output('dataurlnewwindow');
    
    },
    getBase64Image(img) {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      var dataURL = canvas.toDataURL("image/png");
      return dataURL;
    },
    generateQR(){
       this.item = new FormData;
            this.item.append('id_reservasi',this.reservasi.id_reservasi);
            this.item.append('id_karyawan',this.karyawan.id_karyawan)
        var url = this.$api + '/pesanan'
              this.load = true
              this.$http.post(url, this.item, {
                headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                }
              }).then(response => {
                this.error_message = response.data.message;
                this.pesanan=response.data.data;
                this.qr_url=response.data.data.qr_url;
                this.toastVar='success'
                this.title="Success"
                this.toast=true
                this.qrModal=true

              }).catch(error => {
                this.error_message = error.response.data.message;
                this.pesanan=error.response.data.data;
                this.qr_url=error.response.data.qr_url;
                this.qrModal=true
                this.title="Warning!!!"
                this.toastVar='danger'
                this.toast=true
              
              })          
              

      
    },
    deleteItem(){
          this.deleteModal=true
      },
      delete_confirmation(){
          let item = new FormData
          var url = this.$api + '/sdel-reservasi/' + this.reservasi.id_reservasi
        this.$http.post(url,item, {
            headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        }).then(response => {
            this.error_message= response.data.message;
            this.toastVar='success'
            this.title= 'Success'
            this.toast=true
            this.$router.push('/reservation')
           }).catch(error => {
            this.error_message = error.response.data.message;
            this.toastVar='danger'
            this.title= 'Warning!!'
            this.toast=true
            })   
      },
     readKaryawan(){
        var url = this.$api + '/karyawan/'+ localStorage.getItem('email')
        this.$http.get(url, {
            headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        }).then(response => {
            this.karyawan = response.data.data
            
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
           })
      },
    
    editForm(){

      this.editModal=true
      this.tanggal_reservasi_baru=this.reservasi.tanggal_reservasi
      this.session=this.reservasi.sesi_reservasi
      this.readReservasi()
      this.nama_cust_chosen=this.nama_customer
      this.no_meja_selected=this.reservasi.no_meja.toString()
      this.no_meja=this.reservasi.no_meja.toString()
      this.id_customer=this.reservasi.id_customer
      this.sesi.forEach(element => {
        if(element.sesi==this.reservasi.sesi_reservasi){
          this.jam=element.jam
        }
      });
    },
    setCustomer(item){
          this.nama_cust_chosen=item.nama_customer
          this.id_customer=item.id_customer
          this.namaCustomer=''
          
          
      },
      chooseSesi(item){
          this.session=item.sesi
          this.jam=item.jam
      },
      chooseMeja(item){
        this.no_meja=item.no_meja
        this.no_meja_selected=item.no_meja
      },
    readData(){
      var url = this.$api + '/reservasi/'+ localStorage.getItem('reservasiId')
        this.$http.get(url, {
            headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        }).then(response => {
            this.reservasi=response.data.data[0]
            if(this.reservasi.sesi_reservasi==1){
              this.deskripsi_sesi='Lunch | 11.00 - 16.00'
            }else 
              this.deskripsi_sesi='Dinner | 17.00 - 21.00'
            var url = this.$api + '/customer/' + this.reservasi.id_customer
              this.$http.get(url, {
                  headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                  }
              }).then(response => {
                  this.nama_customer = response.data.data[0].nama_customer  
                  console.log(this.nama_customer)
                });
           })
    },
    checkFormValidity() {
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
        this.tanggal_reservasi_baru=''
        this.nameState = null
        this.tanggalState=null
        this.nama_cust_chosen=''
        this.namaCustomer=''
      
      
      },
      handleOk(bvModalEvt) {
        bvModalEvt.preventDefault()
        this.handleSubmit()
      },
      handleSubmit() {
        this.nameState = null
        this.tanggalState =null
   
        if (this.checkFormValidity()>0) {
          return
        }
        
        this.editData()
        this.$nextTick(() => {
          this.$bvModal.hide('modal-prevent-closing')
        })
      },
      editData(){
        let newData = {
        id_customer: this.id_customer,
        tanggal_reservasi: this.tanggal_reservasi_baru,
        sesi_reservasi: this.session,
        no_meja: this.no_meja_selected
        };
        var url = this.$api + "/update-reservasi/" + this.reservasi.id_reservasi;
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
       readReservasi(){
           this.meja.forEach(element => {
              element.status_meja=0
              element.id_reservasi=''
          });
        var url = this.$api + '/reservasi-by-date/'+ this.tanggal_reservasi_baru + '/' + this.session
        this.$http.get(url, {
            headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        }).then(response => {
            this.reservasi_date=response.data.data
           })
       },
  },
  beforeMount(){
    this.readData()
    this.readCustomer()
    this.readMeja()
    this.readKaryawan()
  },
  computed:{
    
    showAutoload(){
            if(this.namaCustomer.length>3)
                return true
            else 
              return false
        },
    res_date(){
      return moment(String(this.reservasi.tanggal_reservasi)).format('dddd, DD MMMM YYYY')
    },
    filteredMeja(){
      this.readReservasi()
           this.meja.forEach(meja => {
               this.reservasi_date.forEach(reservasi => {
                   if(meja.no_meja==reservasi.no_meja){
                       meja.status_meja=1
                       meja.id_reservasi=reservasi.id_reservasi
                       meja.id_customer=reservasi.id_customer
                      
                       
                   }
               });
               
           });
           return this.meja
    },
        filteredRows() {
        return this.customers.filter(row => {
        const id_customer = row.id_customer.toLowerCase();
        const nama_customer = row.nama_customer.toLowerCase();
        const searchTerm = this.namaCustomer.toLowerCase();

        return nama_customer.includes(searchTerm) || id_customer.includes(searchTerm) 
            });
        }
    
  },
    
}
</script>
<style scoped>
::v-deep .header-class{
  background:#EC7309;
  font-weight:bold;
  color:white;
}
body{

  padding-left: 5%;
  padding-right: 5%;
  margin-top:7%; 
}

</style>