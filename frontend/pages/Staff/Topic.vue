<template>
    <v-container fluid class="py-10">
                <v-card>
                    <v-sheet class="pa-4"">
                        <h1 class="text-h5 text-center font-weight-bold">จัดการหัวข้อการประเมิน</h1>
                    </v-sheet>
                    <v-card-text>
                        <v-form @submit.prevent="saveMember">
                            <v-row>
                                <v-col cols="12" md="12">
                                    <v-text-field v-model="form.name_topic" :error-messages="error.name_topic" label="ชื่อหัวข้อการประเมิน"></v-text-field>
                                </v-col>
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-btn class="text-white" color="blue" type="submit" block>{{ form.id_topic ? 'อัปเดต' : 'บันทึก' }}</v-btn>
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
                                    <th class="border text-center">หัวข้อการประเมิน</th>
                                    <th class="border text-center">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_topic">
                                    <td class="border text-center">{{ index+1 }}</td>
                                    <td class="border text-center">{{ items.name_topic }}</td>
                                    <td class="border text-center">
                                        <v-btn class="text-white" size="small" color="warning" @click="edit(items)">แก้ไข</v-btn>&nbsp;
                                        <v-btn class="text-white" size="small" color="error" @click="del(items.id_topic)">ลบ</v-btn>
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

const form = ref({
    id_topic: null,
    name_topic:'',
})

const reset = () => {
    form.value = {
        id_topic: null,
        name_topic:'',
    }
}

const edit = (items:any) => {
    form.value = {...items}
}

const error = ref<Record<string,string>>({})

const emailReget = /^[^\s]+@[^\s]+\.[^\s]{2,}$/i
function vaildateForm(){
    error.value = {}
    const f = form.value
    if(!f.name_topic)error.value.name_topic='กรุณากรอกชื่อหัวข้อ'
    return Object.keys(error.value).length === 0
}

const fetch = async () => {
    try{
        const res = await axios.get(`${staff}/topic`,{headers:{Authorization:`Bearer ${token}`}})
        result.value = res.data
    }catch(err){
        console.error('Error Fething',err)
    }
}

const saveMember = async () =>{
    if(!vaildateForm())return
    try{
        form.value.id_topic
            ? await axios.put(`${staff}/topic/${form.value.id_topic}`,form.value,{headers:{Authorization: `Bearer ${token}`}})
            : await axios.post(`${staff}/topic`,form.value,{headers:{Authorization: `Bearer ${token}`}})
        alert('ทำรายการสำเร็จ')
        await fetch()
        await reset()
    }catch(err){
        console.error('Error Regis Member!',err)
    }
}

const del = async (id_topic:number) => {
    try{
        if(!confirm('ต้องการลบใช่หรือไม่')) return
        await axios.delete(`${staff}/topic/${id_topic}`,{headers:{Authorization:`Bearer ${token}`}})
        await fetch()
        await reset()
    }catch(err){
        console.error('Error Delete',err)
    }
}

onMounted(fetch)
</script>

<style scoped>
.text-maroon{
    color: #7d0c14;
}
</style>