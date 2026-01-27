<template>
    <v-container fluid class="py-10">
                <v-card>
                    <v-sheet class="pa-4"">
                        <h1 class="text-h5 text-center font-weight-bold">สถานะการประเมินของกรรมการ</h1>
                    </v-sheet>
                    <v-card-text>
                        รายชื่อผู้รับการประเมิน
                        <v-table>
                            <thead>
                                <tr>
                                    <th class="border text-center">ลำดับ</th>
                                    <th class="border text-center">ผู้รับการประเมิน</th>
                                    <th class="border text-center">วันที่ออกแบบการประเมิน</th>
                                    <th class="border text-center">รอบการประเมิน</th>
                                    <!-- <th class="border text-center">คะแนนประเมินตนเอง</th> -->
                                    <th class="border text-center">สถานะการประเมิน</th>
                                    <th class="border text-center">รายละเอียด</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_eva">
                                    <td class="border text-center">{{ index+1 }}</td>
                                    <td class="border text-center">{{ items.first_name }} {{ items.last_name }}</td>
                                    <td class="border text-center">{{ items.day_eva }}</td>
                                    <td class="border text-center">รอบการประเมินที่ {{ items.round_sys }} ปี {{ items.year_sys }}</td>
                                    <!-- <td class="border text-center">{{ items.total_eva === null ? 'ผู้รับการประเมินยังไม่ได้ประเมิน' : items.total_eva }}</td> -->
                                    <td class="border text-center">
                                        <v-btn class="text-white" size="small" :color="bg(items.status_eva)">{{ items.status_eva === 1 ? 'ประเมินตนเอง' : items.status_eva === 2 ? 'กรรมการประเมิน' : 'ประเมินเสร็จสิ้น' }}</v-btn>
                                    </td>
                                    <td class="border text-center">
                                        <!-- <v-btn class="text-white" size="small" color="warning" @click="edit(items)">แก้ไข</v-btn>&nbsp; -->
                                        <v-btn class="text-white" size="small" color="success" @click="go(items.id_eva)">รายละเอียด</v-btn>
                                    </td>
                                </tr>
                                <tr v-if="result.length === 0">
                                    <td class="text-center border" colspan="10">ไม่พบข้อมูล</td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-card-text>
                </v-card>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import {api,staff} from '../../API/base'

const token = process.client ? localStorage.getItem('token') : null

const result = ref([])

const fetch = async () => {
    try{
        const res = await axios.get(`${staff}/eva`,{headers:{Authorization:`Bearer ${token}`}})
        result.value = res.data
    }catch(err){
        console.error('Error Fething',err)
    }
}

const bg = (status_eva:number) => {
    if(status_eva ===1) return 'error'
    if(status_eva ===2) return 'warning'
    if(status_eva ===3) return 'success'
}

const go = (id_eva:number) => { 
    navigateTo({path: `Status2-${id_eva}`})
}

onMounted(fetch)
</script>

<style scoped>
.text-maroon{
    color: #7d0c14;
}
</style>