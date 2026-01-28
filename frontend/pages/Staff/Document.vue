<template>
    <v-container fluid class="py-10">
                <v-card>
                    <v-sheet class="pa-4"">
                        <h1 class="text-h5 text-center font-weight-bold">คู่มือสำหรับการประเมิน</h1>
                    </v-sheet>
                    <v-card-text>
                        <v-form @submit.prevent="saveMember">
                            <v-row>
                                <v-col cols="12" md="12">
                                    <v-text-field v-model="name_doc" label="ชื่อเอกสาร"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="12">
                                    <v-file-input v-model="file" accept=".doc,.docx,image/*" />
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

                        <br><br>

                        <v-table>
                            <thead>
                                <tr>
                                    <th class="border text-center">ลำดับ</th>
                                    <th class="border text-center">ชื่อเอกสาร</th>
                                    <th class="border text-center">วันที่เพิ่ม</th>
                                    <th class="border text-center">ไฟล์</th>
                                    <th class="border text-center">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_topic">
                                    <td class="border text-center">{{ index+1 }}</td>
                                    <td class="border text-center">{{ items.name_doc }}</td>
                                    <td class="border text-center">{{ items.day_doc }}</td>
                                    <td class="border text-center">
                                        <v-btn class="text-whtie" size="small" color="warning" prepend-icon="mdi-eye" @click="view(items.file)">เปิดดู</v-btn>
                                    </td>
                                    <td class="border text-center">
                                        <!-- <v-btn class="text-white" size="small" color="warning" @click="edit(items)">แก้ไข</v-btn>&nbsp; -->
                                        <v-btn class="text-white" size="small" color="error" @click="del(items.id_doc)">ลบ</v-btn>
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

const name_doc = ref('')
const file = ref<File | null>(null)

const result = ref([])



const fetch = async () => {
    try{
        const res = await axios.get(`${staff}/doc`,{headers:{Authorization:`Bearer ${token}`}})
        result.value = res.data
    }catch(err){
        console.error('Error Fething',err)
    }
}

const saveMember = async () =>{
    try{
        if(!name_doc.value || !file.value) return alert('กรุณากรอกชื่อไฟล์และเพิ่มเอกสาร')
        const formData = new FormData()
        formData.append('name_doc',name_doc.value)
        formData.append('file',file.value)
        await axios.post(`${staff}/doc`,formData,{headers:{Authorization: `Bearer ${token}`}})
        alert('ทำรายการสำเร็จ')
        await fetch()
    }catch(err){
        console.error('Error Insert',err)
    }
}

const del = async (id_doc:number) => {
    try{
        if(!confirm('ต้องการลบใช่หรือไม่')) return
        await axios.delete(`${staff}/doc/${id_doc}`,{headers:{Authorization:`Bearer ${token}`}})
        await fetch()
    }catch(err){
        console.error('Error Delete',err)
    }
}

const view = (filename:string) => {
    const url = new URL (`/uploads/document/${filename}`,staff).href
    window.open(url,'_blank')
}

onMounted(fetch)
</script>

<style scoped>
.text-maroon{
    color: #7d0c14;
}
</style>