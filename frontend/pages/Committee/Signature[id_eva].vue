<template>
    <v-container fluid class="py-10">
                <v-card>
                    <v-sheet class="pa-4">
                        <h1 class="text-h5 text-center font-weight-bold">คู่มือสำหรับการประเมิน</h1>
                    </v-sheet>
                    <v-card-text>
                        <v-form v-if="!result.signature" @submit.prevent="saveMember">
                            <v-row>
                                <v-col cols="12" md="12">
                                    <v-file-input v-model="file" accept=".doc,.docx,image/*,.pdf" label="file"/>
                                </v-col>
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-btn class="text-white" color="blue" type="submit" block>บันทึก</v-btn>
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-btn class="text-white" color="error" type="reset" block>ยกเลิก</v-btn>
                                    </v-col>
                                </v-row>
                            </v-row>
                        </v-form>
                        <v-table v-else>
                            <thead>
                                <tr>
                                    <th class="border text-center">ลำดับ</th>
                                    <th class="border text-center">ไฟล์</th>
                                    <th class="border text-center">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="border text-center">{{ 1 }}</td>
                                    <td class="border text-center">{{ result.signature }}</td>
                                    <td class="border text-center">
                                        <v-btn class="text-whtie" size="small" color="warning" prepend-icon="mdi-eye" @click="view(result.signature)">เปิดดู</v-btn>&nbsp;&nbsp;
                                        <v-btn class="text-white" size="small" color="error" @click="del(id_eva)">ลบ</v-btn>
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
import {api,commit} from '../../API/base'

const token = process.client ? localStorage.getItem('token') : null

const name_doc = ref('')
const file = ref<File | null>(null)
const id_eva = useRoute().params.id_eva

const result = ref([])



const fetch = async () => {
    try{
        const res = await axios.get(`${commit}/signature/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        result.value = res.data
    }catch(err){
        console.error('Error Fething',err)
    }
}

const saveMember = async () =>{
    try{
        if(!file.value) return alert('กรุณากรอกชื่อไฟล์และเพิ่มเอกสาร')
        const formData = new FormData()
        formData.append('file',file.value)
        await axios.post(`${commit}/signature/${id_eva}`,formData,{headers:{Authorization: `Bearer ${token}`}})
        alert('ทำรายการสำเร็จ')
        await fetch()
    }catch(err){
        console.error('Error Insert',err)
    }
}

const del = async (id_doc:number) => {
    try{
        if(!confirm('ต้องการลบใช่หรือไม่')) return
        await axios.delete(`${commit}/signature/${id_eva}`,{headers:{Authorization:`Bearer ${token}`}})
        await fetch()
    }catch(err){
        console.error('Error Delete',err)
    }
}

const view = (filename:string) => {
    const url = new URL (`/uploads/signature/${filename}`,commit).href
    window.open(url,'_blank')
}

onMounted(fetch)
</script>

<style scoped>
.text-maroon{
    color: #7d0c14;
}
</style>