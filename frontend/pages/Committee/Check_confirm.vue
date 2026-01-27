<template>
    <v-container fluid class="py-10">
                <v-card>
                    <v-sheet class="pa-4">
                        <h1 class="text-h5 font-weight-bold">ดำเนินการประเมิน</h1>
                    </v-sheet>
                    <v-card-text>
                        <v-table>
                            <thead>
                                <tr>
                                    <th class="border text-center">ลำดับ</th>
                                    <th class="border text-center">ชื่อ</th>
                                    <th class="border text-center">นามสกุล</th>
                                    <th class="border text-center">วันที่ออกแบบการประเมิน</th>
                                    <th class="border text-center">รอบการประเมิน</th>
                                    <th class="border text-center">ผลการประเมิน</th>
                                    <th class="border text-center">ดำเนินการประเมิน</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_commit">
                                    <td class="border text-center">{{ index+1 }}</td>
                                    <td class="border text-center">{{ items.first_name }}</td>
                                    <td class="border text-center">{{ items.last_name }}</td>
                                    <td class="border text-center">{{ items.day_eva }}</td>
                                    <td class="border text-center">รอบการประเมินที่ {{ items.round_sys }} ปี {{ items.year_sys }}</td>
                                    <td class="border text-center"><v-btn class="text-white" size="small" color="blue" @click="check(items.id_eva)">ตรวจสอบ</v-btn></td>
                                    <td class="border text-center"><v-btn class="text-white" size="small" color="blue" @click="go(items.id_eva)">ประเมิน</v-btn></td>
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
import {api,commit} from '../../API/base'

const token = process.client ? localStorage.getItem('token') : null

const result = ref([])

const fetch = async () => {
    try{
        const res = await axios.get(`${commit}/show_eva`,{headers:{Authorization:`Bearer ${token}`}})
        result.value = res.data
    }catch(err){
        console.error('Error Fething',err)
    }
}

const go = (id_eva:number) => { 
    navigateTo({path: `/Committee/Save_score${id_eva}`})
}

const check = (id_eva:number) => { 
    navigateTo({path: `/Committee/Score_commit${id_eva}`})
}

onMounted(fetch)
</script>

<style scoped>
.text-maroon{
    color: #7d0c14;
}
</style>