<template>
    <body>
        <div>
        <b-button to="/home" size="md" variant="no-outline" style="margin-bottom:20px;background-color:#A53A1D;font-weight:bold;color:white"><b-icon icon="arrow-bar-left"></b-icon> Kembali</b-button>
          <b-card style="margin:0; box-shadow: 0 0.2rem 0.2rem rgba(0, 0, 0, 0.13)">
              <b-card-title style="font-weight:bold;color:#A53A1D ">
                  Data Transaksi
              </b-card-title>
                   
              <b-row>
                    <b-col>
                    <b-form-group
                    label="Cari Transaksi"
                    label-for="cari_transaksi-input"
                    style="color:#A53A1D;font-weight:bold">
                        <input v-model="filter" type="text" class="form-control" 
                        placeholder="Search..." >
                    </b-form-group>
                </b-col>
              
                 <b-col >
                    <b-form-group
                    label="Tanggal Transaksi"
                    label-for="tanggal_transaksi-input"
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
                        Cari Transaksi
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
                <b-button v-if="filteredRows.item.status_pembayaran=='BELUM BAYAR'" block variant="no-outline" style="background-color:#EC7309;color:white" class="iconEdit"  @click="toogleOpen(filteredRows.item);" v-b-modal.modal-center>
                <b-icon style="color:white" icon="bag-check"></b-icon> Detail Pembayaran
                </b-button>
                 <b-button v-else variant="no-outline" style="background-color:green;color:white" block class="iconEdit"  @click="toogleOpen(filteredRows.item);" v-b-modal.modal-center>
                <b-icon style="color:white" icon="printer"></b-icon> Print Receipt
                </b-button>
            </template>

            </b-table> 

          </b-card>
        </div >
                
         <b-modal v-model="dp_modal" size="xl" @hide="resetModal" centered title="Transaksi Pembayaran"
           >
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
                    <b-col v-if="no_nota==''">
                        Waktu 
                    </b-col>
                    <b-col v-else>
                        Waktu Pembayaran
                    </b-col>
                    <b-col v-if="no_nota==''">
                        : {{tanggal_pesanan_modal}} <b-badge v-if="sesi_modal==1" variant="warning">Lunch</b-badge> <b-badge v-else variant="warning">Dinner</b-badge>
                    </b-col>
                    <b-col v-else>
                        : {{transaksi.updated_at}}
                    </b-col>
                    <b-col>
                        Total Menu
                    </b-col>
                    <b-col>
                        : {{total_menu_modal}}
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        ID Transaksi
                    </b-col>
                    <b-col>
                        : {{transaksi.id_transaksi}}
                    </b-col>
                    <b-col>
                        <div v-if="no_nota!=''">
                            Receipt 
                        </div>
                    </b-col>
                    <b-col>
                        <div v-if="no_nota!=''">
                          : #{{no_nota}}
                        </div>
                    </b-col>
                </b-row>
            </div>
            <div id="tabelMenu">
            <b-table
            :items="detail_pesanan"
            :fields="dp_fields">
            </b-table>
            </div>
            <b-card>
                <b-row >
                <b-col>
                </b-col>
                <b-col>
                </b-col>
                <b-col>
                </b-col>
                <b-col cols="3" style="text-align:right;">
                    Sub Total (Rp)
                </b-col>
                <b-col >
                 {{transaksi.total_harga}}
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                </b-col>
                <b-col>
                </b-col>
                <b-col>
                </b-col>
                <b-col cols="3" style="text-align:right;">
                    Tax (Rp)
                </b-col>
                <b-col >
                    {{transaksi.tax}}
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                </b-col>
                <b-col>
                </b-col>
                <b-col>
                </b-col>
                <b-col cols="3" style="text-align:right;">
                    Service (Rp)
                </b-col>
                <b-col >
                    {{transaksi.service}}
                </b-col>
            </b-row>

            <b-row>
                <b-col>
                </b-col>
                <b-col>
                </b-col>
                <b-col>
                </b-col>
                <b-col cols="3" style="text-align:right;font-weight:bold; font-size:20px">
                    Grand Total (Rp)
                </b-col>
                <b-col style="font-weight:bold; font-size:20px">
                    {{transaksi.grand_total}}
                </b-col>
            </b-row>

            <b-row v-if="no_nota!=''">
                <b-col>
                </b-col>
                <b-col>
                </b-col>
                <b-col>
                </b-col>
                <b-col cols="3" style="text-align:right">
                    Metode Pembayaran
                </b-col>
                <b-col >
                    : {{transaksi.metode_pembayaran}} <p v-if="transaksi.metode_pembayaran!='Uang tunai'">({{transaksi.verifikasi_edc}}) </p>
                </b-col>
            </b-row>
            <b-row style="margin-top:20px" v-else>
                <b-col>
                </b-col>
                <b-col>
                </b-col>
                <b-col>
                </b-col>
                <b-col  cols="3" style="text-align:right;">
                    Pilih Metode Pembayaran
                </b-col>
                <b-col >
                    <b-dropdown  :text="metodePembayaran" size="sm" variant="light-outline">
                        <b-dropdown-item @click="metodePembayaran='Uang tunai'">Uang Tunai</b-dropdown-item>
                        <b-dropdown-item @click="metodePembayaran='Kartu Debit'">Kartu Debit</b-dropdown-item>
                        <b-dropdown-item @click="metodePembayaran='Kartu Kredit (CC)'">Kartu Kredit (CC)</b-dropdown-item>
                    </b-dropdown>
                </b-col>
            </b-row>

            <b-row style="margin-top:5px" v-if="metodePembayaran=='Kartu Debit'||metodePembayaran=='Kartu Kredit (CC)'">
                 <b-col>
                </b-col>
                <b-col>
                </b-col>
                <b-col>
                </b-col>
                <b-col cols="3" style="text-align:right;">
                    No Kartu
                </b-col>
                <b-col>
                    <b-form-group
                    invalid-feedback="Nomor kartu tidak boleh kosong"
                    :state="noKartuState"
                    >
                    <b-form-input size="sm"  
                      v-model="nomor_kartu"
                        :state="noKartuState"
                        :placeholder="nomor_kartu_chosen"
                        type="text" >
                    </b-form-input>
                       <b-card v-show="showAutoload" style="box-shadow: 0 0.7rem 1rem rgba(0, 0, 0, 0.15)">
                          <b-table
                            per-page="5"
                            triped hover 
                            :items="filteredKartu"
                            :fields="fieldKartu"
                            @row-clicked="setKartu"
                            selectable
                            select-mode="single">
                            </b-table>
                        </b-card>
                    </b-form-group>
                </b-col>
             
            </b-row>
            <b-row style="margin-top:5px" v-show="metodePembayaran=='Kartu Debit'||metodePembayaran=='Kartu Kredit (CC)'">
                 <b-col>
                </b-col>
                <b-col>
                </b-col>
                <b-col>
                </b-col>
                <b-col cols="3" style="text-align:right;">
                    Nama Kartu
                </b-col>
                <b-col>
                    <b-form-group
                    invalid-feedback="Nama kartu tidak boleh kosong"
                    :state="nameState"
                    >
                    <b-form-input :state="nameState" size="sm" type="text" placeholder="Nama Kartu" v-model="nama_kartu">
                    </b-form-input>
                    </b-form-group>
                </b-col>
            </b-row>
             <b-row style="margin-top:5px" v-show="metodePembayaran=='Kartu Debit'||metodePembayaran=='Kartu Kredit (CC)'">
                 <b-col>
                </b-col>
                <b-col>
                </b-col>
                <b-col>
                </b-col>
                <b-col cols="3">
                </b-col>
                <b-col >
                    <b-button variant="no-outline" size="sm" style="background-color:#EC7309;color:white; margin-left:50px" @click="tambahKartu()"><b-icon icon="plus"></b-icon> Tambah Kartu</b-button>
                </b-col>
            </b-row>
            </b-card>

             <template #modal-footer="{ cancel}">
                <b-button variant="no-otline" style="background-color:#3D322F; color:white" @click="cancel()">
                    Cancel
                </b-button>
                <b-button v-if="no_nota==''" variant="no-outline" style="background-color:#A53A1D;color:white" @click="prosesTransaksi()">
                    Proses Pembayaran
                </b-button>
                <b-button v-else variant="no-outline" style="background-color:#A53A1D;color:white" @click="cetakNota()">
                   <b-icon icon="printer"></b-icon> Print Nota
                </b-button>
                </template>
         </b-modal>

         <b-modal v-model="modalEdc" centered size="sm" title="Verifikasi Kode EDC" @ok="submitPembayaran">
                <b-form-group
                    label="Verifikasi EDC"
                    label-for="verif-input"
                    invalid-feedback="Verifikasi EDC tidak boleh kosong"
                    :state="verifState"
                    >
                    <b-form-input
                        id="edc-input"
                        v-model="input_edc"
                        :state="verifState"
                        placeholder="Masukan kode verifikasi"
                    ></b-form-input>
                </b-form-group>

         </b-modal>

        <b-modal v-model="modalUang" centered  title="Jumlah uang yang dibayar" @ok="submitUang">
                <b-form-group
                    label="Uang yang dibayar"
                    label-for="verif-input"
                    invalid-feedback="Jumlah uang yang dibayarkan kurang"
                    :state="uangState"
                    >
                    <b-form-input
                        id="edc-input"
                        v-model="uang_pembayaran"
                        :state="uangState"
                        placeholder="Masukan jumlah uang yang dibayarkan"
                    ></b-form-input>
                </b-form-group>
            
                    <p style="font-weight:bold">{{kembalian}}</p>
               

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
import { jsPDF } from "jspdf"
import 'jspdf-autotable'
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
                {key:'id_transaksi',
                 sortable:true},
                 {key:'id_pesanan',
                 sortable:true},
                 {key:'nama_customer',
                  sortable:true},
                 {key: 'no_meja',
                 sortable:true},
                 {key:'total_item'},
                 {key:'total_menu'},
                 {key:'sub_total'},
                 {key:'status_pembayaran'},
                 {key: 'action'},
            ],
            dp_fields:[
                {key:'id_detil_pesanan'},
                {key:'id_menu'},
                {key:'nama_menu'},
                {key:'jumlah_pesanan'},
                {key:'harga_menu'},
                {key:'subtotal_harga'}
                
            ],
            fieldKartu:[
                {key:'nomor_kartu',
                thStyle: {display: 'none'}},
                {key:'nama_kartu',
                thStyle: {display: 'none'}},
                {key:'jenis_kartu',
                thStyle: {display: 'none'}}
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
            status:'',
            jabatan:'',
            transaksi:[],
            metodePembayaran:'Pilih Metode',
            nomor_kartu:'',
            kartus:[],
            noKartuState:null,
            nomor_kartu_chosen:'Nomor Kartu',
            nama_kartu:'',
            nameState:null,
            modalEdc:false,
            verifState:null,
            input_edc:'',
            id_kartu:'',
            karyawan:[],
            id_transaksi:'',
            uangState:null, 
            uang_pembayaran:'',
            modalUang:false,
            no_nota:'',
            waiter:''
            
        }
    },

    methods:{
        submitUang(bvModalEvt){
             if(this.uang_pembayaran.length<1 || this.uang_pembayaran<this.transaksi.grand_total){
                this.uangState=false
                bvModalEvt.preventDefault()
            }else{
                this.updateTransaksi()
            }
        },
        submitPembayaran(bvModalEvt){
            if(this.input_edc.length<1){
                this.verifState=false
                bvModalEvt.preventDefault()
            }
            else{
               this.updateTransaksi()
            }
        },
        updateTransaksi(){
             let newData = {
                    metode_pembayaran: this.metodePembayaran,
                    verifikasi_edc : this.input_edc,
                    id_kartu : this.id_kartu,
                    id_karyawan: this.karyawan.id_karyawan,
                    status_pembayaran : 'SUKSES'

                    
                    };
                    var url = this.$api + "/update-transaksi/" + this.id_transaksi;
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
                        this.dp_modal=false
                    }).catch(error => {
                        this.error_message = error.response.data.message;
                        this.toastVar='danger'
                        this.title= 'Warning!!'
                        this.toast=true
                        });
                this.readData()
        },
        prosesTransaksi(){
            var count=0;
            if(this.metodePembayaran=="Kartu Kredit (CC)" && this.nama_kartu==''){
                this.nameState=false
                count++;
            }else{
                this.nameState=true
            }

            if(this.nomor_kartu!=''||this.nomor_kartu_chosen!=''){
                this.noKartuState=true
                
            }else{
                count++;
                this.noKartuState=false
            }

           if (this.metodePembayaran=='Uang tunai'){
                    this.modalUang=true
            }else if(this.metodePembayaran!='Pilih Metode'){
                if(count==0){
                    this.modalEdc=true
                }
            }
        },
        tambahKartu(){
            var count=0;
            if(this.metodePembayaran=="Kartu Kredit (CC)" && this.nama_kartu==''){
                this.nameState=false
                count++;
            }else{
                this.nameState=true
            }

            if(this.nomor_kartu==''){
                this.noKartuState=false
                count++;
            }else{
                this.noKartuState=true
            }

            if(count==0){
                  this.item = new FormData;
                    this.item.append('jenis_kartu',this.metodePembayaran);
                    this.item.append('nama_kartu',this.nama_kartu);
                    this.item.append('nomor_kartu',this.nomor_kartu)
                var url = this.$api + '/kartu'
                    this.load = true
                    this.$http.post(url, this.item, {
                        headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                        }
                    }).then(response => {
                        this.error_message = response.data.message;
                        this.id_kartu=response.data.data.id_kartu;
                        this.title="Success"
                        this.toastVar="success"
                        this.toast=true

                    }).catch(error => {
                        this.error_message = error.response.data.message;
                        this.title="Warning!!"
                        this.toastVar="danger"
                        this.toast=true
                    })          
                this.readKartu();

            }
        },
        
        resetModal() {
        this.metodePembayaran='Pilih Metode'
        this.nama_kartu=''
        this.nomor_kartu=''
        this.nomor_kartu_chosen='Nomor Kartu'
        this.no_nota=''
      
      },
        setKartu(item){
            console.log(item)
          this.nomor_kartu='';
          this.nama_kartu= item.nama_kartu;
          this.nomor_kartu_chosen=item.nomor_kartu;
          this.id_kartu= item.id_kartu
          
      },
        setStatus(item){
            this.status = item;
        },

        toogleOpen(item){
            
            this.readDetailPesanan(item.id_pesanan);
            this.nama_modal=item.nama_customer
            this.no_meja_modal=item.no_meja
            this.tanggal_pesanan_modal=item.tanggal_pesanan
            this.sesi_modal=item.sesi_reservasi
            this.total_item_modal=item.total_item
            this.total_menu_modal=item.total_menu
            this.transaksi = item
            this.id_transaksi = item.id_transaksi
            if(item.status_pembayaran=='SUKSES'){
                this.no_nota=item.no_nota
            }
            this.readKaryawanById(item.id_karyawan);
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
        var url = this.$api + '/transaksi/' + this.tanggal_pesanan + '/' + this.session
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
      readKartu(){
        var url = this.$api + '/kartu/'
        this.$http.get(url, {
            headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        }).then(response => {
            this.kartus = response.data.data
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
     readKaryawanById(id_karyawan){
        var url = this.$api + '/karyawan-by-id/'+ id_karyawan
        this.$http.get(url, {
            headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        }).then(response => {
            this.waiter= response.data.data
            
           })
     },
     cetakNota(){
         
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds() )
        const date = new Date(today)
        let tanggal_cetak = 'Printed '+ moment(String(date)).format('MMMM DD, YYYY h:mm:ss A')
        let karyawan = 'Cashier: ' + this.karyawan.nama_karyawan;
        const doc = new jsPDF({
        orientation: "potrait",
        unit: "in",
        format: [5.5, 4]
        });
        var img = new Image;
        img.src ="../../assets/logo.png";
        img.onload= function(){
            doc.addImage(img,'PNG',2,0.5)
        }

        doc.text("ATMA KOREAN BBQ",2,0.5, 'center');
        var tanggal_pembayaran = moment(this.transaksi.updated_at).format("DD/MM/yyyy");
        var waktu_pembayaran = moment(this.transaksi.updated_at).format("hh:mm");
        doc.setFontSize(6);
        doc.text("Receipt", 0.5,1.1);
        
        doc.text("#"+this.transaksi.no_nota, 1,1.1);
        doc.text("Date", 2.2,1.1);
        doc.text(tanggal_pembayaran, 2.7,1.1);
        doc.text("Waiter", 0.5,1.25);
        doc.text(this.waiter.nama_karyawan, 1,1.25);
        doc.text("Time", 2.2,1.25);
        doc.text(waktu_pembayaran, 2.7,1.25);
        doc.text("Table", 0.5,1.4);
        doc.text("#"+ this.no_meja_modal, 1,1.4);
        doc.text("Customer", 2.2,1.4);
        doc.text(this.nama_modal, 2.7,1.4);
          
     //     doc.line(0.3, 1.5, 3.5, 1.5); // horizontal line    
       // doc.setLineWidth(0.1);  
        // Using autoTable plugin  
        doc.autoTable({
             
              columnStyles: { transaksi: { halign: 'center' } }, // European countries centered
              styles: { 
                  fillColor: [255,255,255],
                  fontSize: 7,},
              theme : 'plain',
              body: this.detail_pesanan,
              columns: [
                { header: 'Qty', dataKey: 'jumlah_pesanan' },
                { header: 'Nama Menu', dataKey:'nama_menu'},
                { header: 'Harga (Rp)', dataKey:'harga_menu'},
                { header: 'Sub Total (Rp)', dataKey:'subtotal_harga'},
              ],
        
              margin: { left: 0.5, top: 1.65}
        }); 
         
        let finalY = doc.lastAutoTable.finalY; 
     
          doc.line(0.3, finalY+0.1, 3.5, finalY+0.1); // horizontal line    
          doc.setLineWidth(0.5);    
          doc.setFontSize(7);
          doc.text("Sub total", 1.9,finalY+0.3);
          doc.text("Rp " +this.transaksi.sub_total.toString(), 2.65,finalY+0.3);
          doc.text("Tax 10%", 1.9,finalY+0.45);
          doc.text("Rp " + this.transaksi.tax.toString(), 2.65,finalY+0.45);
          doc.text("Service 5%", 1.9,finalY+0.6);
          doc.text("Rp " + this.transaksi.service.toString(), 2.65,finalY+0.6);


          //doc.line(0.3, finalY+0.5, 3.5, finalY+0.5); // horizontal line    
         // doc.setLineWidth(1); 
         // doc.setFontSize(7);
          doc.text("TOTAL", 1.9,finalY+0.9);
          doc.text("Rp " +this.transaksi.grand_total.toString(), 2.65,finalY+0.9);

       //   doc.line(0.3, finalY+0.5, 3.5, finalY+0.5); // horizontal line    
        //  doc.setLineWidth(1); 
          
        
 
        doc.setFontSize(6);

        doc.text("Total Qty: " + this.total_item_modal, 0.5,finalY+0.3);
        doc.text("Total Item: " + this.total_menu_modal, 0.5,finalY+0.4);
        doc.text(tanggal_cetak, 2.17,finalY+2);
        doc.text(karyawan, 2.81,finalY+2.2);

        // Creating footer and saving file
        doc.text(
            "Thank you for your visit!",
            0.5,
            doc.internal.pageSize.height - 0.2
            )
            .save(`Transaction.pdf`); 
        doc.output('dataurlnewwindow');

    
   
     },
   
    },
    beforeMount(){
      this.readData()
      this.readJabatan()
      this.readKartu()
      this.readKaryawan()
      
    },
    computed:{
    kembalian(){
        var kembali = this.uang_pembayaran-this.transaksi.grand_total;
        if(this.uang_pembayaran>this.transaksi.grand_total)
            return 'Kembalian : Rp '+kembali
        else if (this.uang_pembayaran<this.transaksi.grand_total)
            return 'Jumlah uang kurang Rp '+ kembali
        else   
            return ''
    },
    showAutoload(){
            if(this.nomor_kartu.length>3)
                {return true}
            else
                return false
        },
      
    filteredRows() {
        return this.rows.filter(row => {
        const id_pesanan = row.id_pesanan?.toLowerCase();
        const no_meja = row.no_meja?.toString().toLowerCase();
        const searchTerm = this.filter?.toLowerCase();
        return id_pesanan?.includes(searchTerm) ||
            no_meja?.includes(searchTerm);
    });
    
    
  },
   filteredKartu() {
        return this.kartus.filter(row => {
        const no_kartu = row.nomor_kartu.toLowerCase();
        const searchTerm = this.nomor_kartu.toLowerCase();

        return no_kartu.includes(searchTerm)
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

</style>
