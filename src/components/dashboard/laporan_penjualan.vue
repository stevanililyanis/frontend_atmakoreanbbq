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
                    label="Tahun"
                    style="color:#A53A1D;font-weight:bold"
                    >
                    <b-dropdown  :text="tahun" variant="outline-secondary" style="width:100%">
                        <b-dropdown-item v-for="item in years" :key="item" @click="tahun=item" >{{item}}</b-dropdown-item>
                    </b-dropdown>
                   
                </b-form-group>
                </b-col>
                <b-col >
              
                <b-form-group 
                    label="Bulan"
                    style="color:#A53A1D;font-weight:bold"
                    >
                    <b-dropdown  :text="bulan" variant="outline-secondary" style="width:100%">
                        <b-dropdown-item v-for="item in months" :key="item" @click="bulan=item.month; idx=item.index" >{{item.month}}</b-dropdown-item>
                    </b-dropdown>
                   
                </b-form-group>
                </b-col>
                <b-col  >
                     <b-form-group
                    label="."
                    style="color:white;font-weight:bold; "
                    >
                    <b-button block @click="readReservasi()" variant="no-outline" style="color:white;background-color:#EC7309">
                      <b-icon icon="file-earmark-bar-graph"></b-icon>  Buat Laporan
                    </b-button>
                    </b-form-group>
                </b-col>
                <b-col cols="2">
                   
                    
                </b-col>
              </b-row>
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
                {month:'All',
                 index: 0},
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
            idx:''
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
