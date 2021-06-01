<template>
    <body>
        <div>
        <b-button to="/laporan" size="md" variant="no-outline" style="margin-bottom:20px;background-color:#A53A1D;font-weight:bold;color:white"><b-icon icon="arrow-bar-left"></b-icon> Kembali</b-button>
          <b-card style="margin:0; box-shadow: 0 0.2rem 0.2rem rgba(0, 0, 0, 0.13)">
              <b-card-title style="font-weight:bold;color:#A53A1D ">
                  Laporan Stok Bahan Atma Korean BBQ
              </b-card-title>


              <b-row>
                  <b-col>
                    <b-form-group
                    label="Format Laporan"
                    style="color:#A53A1D;font-weight:bold"
                    >
                   <b-dropdown  :text="jenisLaporan" variant="outline-secondary" style="width:100%">
                        <b-dropdown-item @click="jenisLaporan='Custom Period'">Custom Period</b-dropdown-item>
                        <b-dropdown-item @click="jenisLaporan='Month Year'">Month Year</b-dropdown-item>
                    </b-dropdown>
                </b-form-group>
                </b-col>
                <b-col >
                    <b-form-group
                    v-if="jenisLaporan=='Custom Period'"
                    label="Tanggal Mulai"
                    label-for="tanggal_reservasi-input"
                    style="color:#A53A1D;font-weight:bold"
                    >
                      <b-form-datepicker string v-model="tanggal_mulai"    locale="id"></b-form-datepicker>

                </b-form-group>

                <b-form-group v-else-if="jenisLaporan=='Month Year'"
                    label="Bulan"
                    style="color:#A53A1D;font-weight:bold"
                    >
                    <b-dropdown  :text="bulan" variant="outline-secondary" style="width:100%">
                        <b-dropdown-item v-for="item in months" :key="item" @click="bulan=item.month; idx=item.index" >{{item.month}}</b-dropdown-item>
                    </b-dropdown>
                   
                </b-form-group>
                </b-col>
                <b-col>
                    <b-form-group
                    v-if="jenisLaporan=='Custom Period'"
                    label="Tanggal Selesai"
                    label-for="tanggal_reservasi-input"
                    style="color:#A53A1D;font-weight:bold"
                    >
                      <b-form-datepicker string v-model="tanggal_selesai"    locale="id"></b-form-datepicker>

                </b-form-group>
                <b-form-group v-else-if="jenisLaporan=='Month Year'"
                    label="Tahun"
                    style="color:#A53A1D;font-weight:bold"
                    >
                    <b-dropdown  :text="tahun" variant="outline-secondary" style="width:100%">
                        <b-dropdown-item v-for="item in years" :key="item" @click="tahun=item" >{{item}}</b-dropdown-item>
                    </b-dropdown>
                   
                </b-form-group>
                </b-col>
                <b-col v-if="jenisLaporan=='Month Year'">
                        <b-form-group
                        label="Item Menu"
                        style="color:#A53A1D;font-weight:bold"
                        >
                        <b-dropdown  :text="item_menu" variant="outline-secondary" style="width:100%">
                            <b-dropdown-item v-for="item in menu" :key="item" @click="item_menu=item.nama_menu" >{{item.nama_menu}}</b-dropdown-item>
                        </b-dropdown>
                    
                    </b-form-group>
                </b-col>
                <b-col cols="2">
                    <b-form-group
                    v-if="jenisLaporan=='Custom Period'"
                    label="."
                    style="color:white;font-weight:bold; "
                    >
                    <b-button block @click="getLaporanCP(tanggal_mulai, tanggal_selesai)" variant="no-outline" style="color:white;background-color:#EC7309">
                      <b-icon icon="file-earmark-bar-graph"></b-icon>  Buat Laporan
                    </b-button>
                    </b-form-group>
                    
                    <b-form-group
                    v-else-if="jenisLaporan=='Month Year'"
                    label="."
                    style="color:white;font-weight:bold; "
                    >
                    <b-button block @click="readReservasi()" variant="no-outline" style="color:white;background-color:#EC7309">
                      <b-icon icon="file-earmark-bar-graph"></b-icon>  Buat Laporan
                    </b-button>
                    </b-form-group>
                    
                </b-col>
              </b-row>
              <p v-show="kategori" style="font-weight:bold">Main Dish</p>
              <b-table
              v-if="jenisLaporan=='Custom Period'"
              v-show="tabelMain"
              :field="field"
              :items="lapMakanan">
              </b-table>
               <p v-show="kategori" style="font-weight:bold">Side Dish</p>
              <b-table
              v-if="jenisLaporan=='Custom Period'"
              v-show="tabelSide"
              :field="field"
              :items="lapSideDish">
              </b-table>
               <p v-show="kategori" style="font-weight:bold">Drinks</p>
              <b-table
              v-if="jenisLaporan=='Custom Period'"
              v-show="tabelMinuman"
              :field="field"
              :items="lapMinuman">
              </b-table>
          </b-card>
        </div>
    </body>
</template>
<script>

export default {
    data(){
        return{
            jenisLaporan:'Pilih Format Laporan',
            tanggal_mulai:'',
            tanggal_selesai:'',
            years:[
                '2018',
                '2019',
                '2020',
                '2021'
            ],
            months:[
                {month:'Januari',
                 index: 1},
                {month:'Februari',
                index: 2},
                {month:'Maret',
                index: 3},
                {month:'April',
                 index: 4},
                {month:'Mei',
                index: 5},
                {month:'Juni',
                index: 6},
                {month:'Juli',
                 index: 7},
                {month:'Agustus',
                 index: 8},
                {month:'September',
                 index: 9},
                {month:'Oktober',
                 index: 10},
                {month:'November',
                index: 11},
                {month:'Desember',
                 index: 12},
              
            ],
            tahun:'Pilih Tahun',
            bulan:'Pilih Bulan',
            idx:'',
            side_dish:[{
                incoming:[],
                waste:[]
            }],
            makanan:[{
                incoming:[],
                waste:[]
            }],
            minuman:[{
                incoming:[],
                waste:[]
            }],
            lapMakanan:[],
            lapSideDish:[],
            lapMinuman:[],
            menu:[],
            tabelMain:false,
            tabelSide:false,
            tabelMinuman:false,
            field:[
                {key:'no'},
                {key:'nama_menu'},
                {key:'incoming_stock'},
                {key:'remaining_stock'},
                {key:'waste_stock'},
        
            ],
            kategori:false,
            item_menu:'Pilih Menu',
            incoming:[],
            waste:[],
            lapItem:[]
        }
    },
    methods:{
        getLaporanStok(bulan, tahun, id_menu){
            var url = this.$api + '/laporan-stok-item/'+bulan+'/'+tahun+'/'+id_menu
            this.$http.get(url, {
            headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
            }).then(response => {
                    incoming = response.data.incoming
                    waste= response.data.waste
                })

        },
        getLaporanCP(tanggal_mulai, tanggal_selesai){
        this.lapMakanan=[]
        this.lapMinuman=[]
        this.lapSideDish=[]
             var url = this.$api + '/laporan-custom-period/'+tanggal_mulai+'/'+tanggal_selesai
            this.$http.get(url, {
            headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        }).then(response => {
            this.makanan.incoming= response.data.main_incoming
            this.makanan.waste= response.data.main_waste
            this.side_dish.incoming= response.data.side_incoming
            this.side_dish.waste= response.data.side_waste
            this.minuman.incoming= response.data.drinks_incoming
            this.minuman.waste= response.data.drinks_waste

            
            this.menu.forEach(menu => {
              
            var lapMakanan=[]
            var lapMinuman=[]
            var lapSide=[]
               if(menu.jenis_menu=='Main Dish'){
                   
                    lapMakanan.nama_menu = menu.nama_menu
                    lapMakanan.unit = menu.unit
                    
                    this.makanan.incoming.forEach(incoming => {
                        if(menu.nama_menu==incoming.nama_menu){
                            lapMakanan.incoming_stock=incoming.incoming_stock
                            lapMakanan.remaining_stock=incoming.remaining_stock
                        }else{
                            lapMakanan.incoming_stock=0
                            lapMakanan.remaining_stock=0
                        }
                    });

                    this.makanan.waste.forEach(waste => {
                        if(menu.nama_menu==waste.nama_menu){
                            lapMakanan.waste_stock = waste.waste_stock
                        }else{
                            lapMakanan.waste_stock=0
                        }
                        
                    });
                this.lapMakanan.push(lapMakanan);
               }else if (menu.jenis_menu=='Side Dish'){
                    lapSide.nama_menu = menu.nama_menu
                    lapSide.unit = menu.unit
                    this.side_dish.incoming.forEach(incoming => {
                    if(menu.nama_menu==incoming.nama_menu){
                        lapSide.incoming_stock=incoming.incoming_stock
                        lapSide.remaining_stock=incoming.remaining_stock
                    }else{
                        lapSide.incoming_stock=0
                        lapSide.remaining_stock=0
                    }
                    });

                    this.side_dish.waste.forEach(waste => {
                        if(menu.nama_menu==waste.nama_menu){
                            lapSide.waste_stock = waste.waste_stock
                        }else{
                            lapSide.waste_stock=0
                        }
                        
                    });
                    this.lapSideDish.push(lapSide);
               }else{
                   lapMinuman.nama_menu = menu.nama_menu
                    lapMinuman.unit = menu.unit
                    this.minuman.incoming.forEach(incoming => {
                    if(menu.nama_menu==incoming.nama_menu){
                        lapMinuman.incoming_stock=incoming.incoming_stock
                        lapMinuman.remaining_stock=incoming.remaining_stock
                    }else{
                        lapMinuman.incoming_stock=0
                        lapMinuman.remaining_stock=0
                    }
                    });

                    this.minuman.waste.forEach(waste => {
                        if(menu.nama_menu==waste.nama_menu){
                            lapMinuman.waste_stock = waste.waste_stock
                        }else{
                            lapMinuman.waste_stock=0
                        }
                        
                    });
                    this.lapMinuman.push(lapMinuman);
               }

                
                
                
                this.tabelMain=true
                this.tabelSide=true
                this.tabelMinuman=true
                this.kategori=true
            });

        })},
        readMenu(){
        var url = this.$api + '/menu'
        this.$http.get(url, {
            headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        }).then(response => {
            this.menu= response.data.data
           })
      }
    },
    beforeMount(){
        this.readMenu()
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
