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
                        <b-dropdown-item @click="jenisLaporan='Tahun';tabel_laporan=false">Tahun</b-dropdown-item>
                        <b-dropdown-item @click="jenisLaporan='Bulanan'">Bulanan</b-dropdown-item>
                    </b-dropdown>
                </b-form-group>
                </b-col>
                <b-col >
                    <b-form-group
                    v-if="jenisLaporan=='Tahun'"
                    label="Tahun Mulai"
                    label-for="tahun_reservasi-input"
                    style="color:#A53A1D;font-weight:bold"
                    >
                      <b-dropdown  :text="tahun_mulai" variant="outline-secondary" style="width:100%">
                        <b-dropdown-item v-for="item in years" :key="item" @click="tahun_mulai=item" >{{item}}</b-dropdown-item>
                    </b-dropdown>

                </b-form-group>

                <b-form-group v-else-if="jenisLaporan=='Bulanan'"
                    label="Tahun"
                    style="color:#A53A1D;font-weight:bold"
                    >
                    
                   <b-dropdown  :text="tahun" variant="outline-secondary" style="width:100%">
                        <b-dropdown-item v-for="item in years" :key="item" @click="tahun=item" >{{item}}</b-dropdown-item>
                    </b-dropdown>
                </b-form-group>
                </b-col>
                <b-col>
                     <b-form-group
                    v-if="jenisLaporan=='Tahun'"
                    label="Tahun Selesai"
                    label-for="tahun_reservasi-input"
                    style="color:#A53A1D;font-weight:bold"
                    >
                      <b-dropdown  :text="tahun_selesai" variant="outline-secondary" style="width:100%">
                        <b-dropdown-item v-for="item in years" :key="item" @click="tahun_selesai=item" >{{item}}</b-dropdown-item>
                    </b-dropdown>
                     </b-form-group>

                      <b-form-group
                    v-else-if="jenisLaporan=='Bulanan'"
                    label="."
                    style="color:white;font-weight:bold; "
                    >
                    <b-button  @click="getLaporanBulanan(tahun)" variant="no-outline" style="color:white;background-color:#EC7309; width:50%">
                      <b-icon icon="file-earmark-bar-graph"></b-icon>  Buat Laporan
                    </b-button>
                    </b-form-group>
                    
                </b-col>
                <b-col cols="2">
                    <b-form-group
                    v-if="jenisLaporan=='Tahun'"
                    label="."
                    style="color:white;font-weight:bold; "
                    >
                    <b-button block @click="getLaporanTahunan(tahun_mulai,tahun_selesai)" variant="no-outline" style="color:white;background-color:#EC7309">
                      <b-icon icon="file-earmark-bar-graph"></b-icon>  Buat Laporan
                    </b-button>
                    </b-form-group>
                    
                   
                </b-col>
              </b-row>

                <b-table
                vif="jenisLaporan=='Bulanan'"
                v-show="tabel_laporan"
                id="my-table"
                :items="lapBulanan" 
                :fields="fdLap"
                 class="mt-3" outlined

                ></b-table>

                 <b-table
                vif="jenisLaporan=='Tahunan'"
                v-show="tabel_tahunan"
                id="my-table"
                :items="lapTahunan" 
                :fields="fdLapT"
                 class="mt-3" outlined

                ></b-table>
              
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
            tahun_mulai:'Pilih Tahun',
            tahun_selesai:'Pilih Tahun',
            tahun:'Pilih Tahun',
            mainDish:[],
            sideDish:[],
            drinks:[],
            lapBulanan:[
                {month:'Januari',
                 index: 1,
                 makanan:0,
                 side_dish:0,
                 minuman:0,
                 total_pendapatan:0},
                {month:'Februari',
                index: 2,
                 makanan:0,
                 side_dish:0,
                 minuman:0,
                 total_pendapatan:0},
                {month:'Maret',
                index: 3,
                 makanan:0,
                 side_dish:0,
                 minuman:0,
                 total_pendapatan:0},
                {month:'April',
                 index: 4,
                 makanan:0,
                 side_dish:0,
                 minuman:0,
                 total_pendapatan:0},
                {month:'Mei',
                index: 5,
                 makanan:0,
                 side_dish:0,
                 minuman:0,
                 total_pendapatan:0},
                {month:'Juni',
                index: 6,
                 makanan:0,
                 side_dish:0,
                 minuman:0,
                 total_pendapatan:0},
                {month:'Juli',
                 index: 7,
                 makanan:0,
                 side_dish:0,
                 minuman:0,
                 total_pendapatan:0},
                {month:'Agustus',
                 index: 8,
                 makanan:0,
                 side_dish:0,
                 minuman:0,
                 total_pendapatan:0},
                {month:'September',
                 index: 9,
                 makanan:0,
                 side_dish:0,
                 minuman:0,
                 total_pendapatan:0},
                {month:'Oktober',
                 index: 10,
                 makanan:0,
                 side_dish:0,
                 minuman:0,
                 total_pendapatan:0
                 },
                {month:'November',
                index: 11,
                 makanan:0,
                 side_dish:0,
                 minuman:0,
                 total_pendapatan:0},
                {month:'Desember',
                 index: 12,
                 makanan:0,
                 side_dish:0,
                 minuman:0,
                 total_pendapatan:0},
              
            ],
            fdLap:[
                {key:'index'},
                {key:'month'},
                {key:'makanan'},
                {key:'side_dish'},
                {key:'minuman'},
                {key:'total_pendapatan'},
            ],
            fdLapT:[
                {key:'no'},
                {key:'tahun'},
                {key:'makanan'},
                {key:'side_dish'},
                {key:'minuman'},
                {key:'total_pendapatan'},
            ],
            tabel_laporan:false,
            lapTahunan:[
            ],
            tabel_tahunan:false
    
        }
    },
    methods:{
        getLaporanTahunan(tahunMulai, tahunSelesai){
            this.lapTahunan=[]
            var url = this.$api + '/laporan-pendapatan-tahunan/'+tahunMulai+'/'+tahunSelesai
            this.$http.get(url, {
            headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        }).then(response => {
            this.mainDish= response.data.main_dish
            this.sideDish= response.data.side_dish
            this.drinks= response.data.drinks
            var no = 1;
            
            for(var i=tahunMulai; i<=tahunSelesai;i++){
            var lap=[];
                lap.no=no;
                lap.tahun=i;
                lap.makanan=0
                lap.side_dish=0
                lap.minuman=0
                lap.total_pendapatan=0
                this.mainDish.forEach(makanan => {
                    if(makanan.tahun == i)
                    {
                        lap.makanan= makanan.main_dish
                    }
                    else{
                        lap.makanan = 0
                    }
                    
                });

                 this.sideDish.forEach(side=> {
                    if(side.tahun == i)
                    {
                        lap.side_dish= side.side_dish
                    }else{
                        lap.side_dish=0
                    }
                    
                });

                this.drinks.forEach(minuman=> {
                    
                    if(minuman.tahun == i)
                    {
                        lap.minuman= minuman.drinks
                    }else{
                        lap.minuman=0
                    }
                    
                });

    
                lap.total_pendapatan= Number(lap.makanan) + Number(lap.side_dish) + Number(lap.minuman);

                this.lapTahunan.push(lap);
                no++;

            }
            this.tabel_tahunan=true

            })
        },
        getLaporanBulanan(tahun){
            this.lapBulanan=[]
            var url = this.$api + '/laporan-pendapatan-bulanan/'+tahun
            this.$http.get(url, {
            headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        }).then(response => {
            this.mainDish= response.data.main_dish
            this.sideDish= response.data.side_dish
            this.drinks= response.data.drinks

            this.lapBulanan.forEach(bulan => {
                this.mainDish.forEach(makanan => {
                    if(bulan.index==makanan.bulan){
                        bulan.makanan=makanan.main_dish
                    }
                });
                
                this.sideDish.forEach(side => {
                    if(bulan.index==side.bulan){
                        bulan.side_dish=side.side_dish
                    }
                });

                this.drinks.forEach(minum => {
                    if(bulan.index==minum.bulan){
                        bulan.minuman=minum.drinks
                    }
                });

                bulan.total_pendapatan = Number(bulan.makanan) + Number(bulan.minuman) + Number(bulan.side_dish)
                this.tabel_laporan=true
                
            });
           })
   
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
