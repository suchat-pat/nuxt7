<template>
    <v-container fluid class="py-10">
                <v-card>
                    <v-sheet class="pa-4"">
                        <h1 class="text-h5 text-center font-weight-bold">จัดการกรรมการประเมิน</h1>
                    </v-sheet>
                    <v-card-text>
                        <v-form @submit.prevent="saveMember">
                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-text-field v-model="form.first_name" :error-messages="error.first_name" label="ชื่อ"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field v-model="form.last_name" :error-messages="error.last_name" label="นามสกุล"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="12">
                                    <v-text-field v-model="form.email" :error-messages="error.email" label="อีเมล"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field v-model="form.username" :error-messages="error.username" label="ชื่อผู้ใช้"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field type="password" v-model="form.password" :error-messages="error.password" label="รหัสผ่าน"></v-text-field type="password">
                                </v-col>
                                <v-col cols="12">
                                    <v-select :items="['กรรมการประเมิน']" v-model="form.role" :error-messages="error.role" label="เลือกประเภทสมาชิก"></v-select :items="['ฝ่ายบุคลากร','','']">
                                </v-col>
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-btn class="text-white" color="blue" type="submit" block>{{ form.id_member ? 'อัปเดต' : 'บันทึก' }}</v-btn>
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
                                    <th class="border text-center">ชื่อ-นามสกุล</th>
                                    <th class="border text-center">อีเมล</th>
                                    <th class="border text-center">ชื่อผู้ใช้</th>
                                    <th class="border text-center">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(items,index) in result" :key="items.id_member">
                                    <td class="border text-center">{{ index+1 }}</td>
                                    <td class="border text-center">{{ items.first_name }} {{ items.last_name }}<br><span class="opacity-85">{{ items.role }}</span></td>
                                    <td class="border text-center">{{ items.email }}</td>
                                    <td class="border text-center">{{ items.username }}</td>
                                    <td class="border text-center">
                                        <v-btn class="text-white" size="small" color="warning" @click="edit(items)">แก้ไข</v-btn>&nbsp;
                                        <v-btn class="text-white" size="small" color="error" @click="del(items.id_member)">ลบ</v-btn>
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
    id_member: null,
    first_name:'',
    last_name:'',
    email:'',
    username:'',
    password:'',
    role:'',
})

const reset = () => {
    form.value = {
        id_member: null,
    first_name:'',
    last_name:'',
    email:'',
    username:'',
    password:'',
    role:'',
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
    if(!f.first_name.trim())error.value.first_name='กรุณากรอกชื่อ!'
    if(!f.last_name.trim())error.value.last_name='กรุณากรอกนามสกุล!'
    if(!f.email.trim())error.value.email='กรุณากรอกอีเมล!'
    else if(!emailReget.test(f.email.trim()))error.value.email='รูปแบบอีเมลไม่ถูกต้อง!'
    if(!f.username.trim())error.value.username='กรุณากรอกชื่อผู้ใช้!'
    else if(f.username.trim().length < 4)error.value.username='ต้องมีอย่างน้อย 4 ตัวอักษร!'
    // if(!f.password.trim())error.value.password='กรุณากรอกรหัสผ่าน!'
    // else if(f.password.trim().length < 6)error.value.password='ต้องมีอย่างน้อย 6 ตัวอักษร!'
    if(!f.role.trim())error.value.role='กรุณาเลือกประเภทสมาชิก!'
    return Object.keys(error.value).length === 0
}

const fetch = async () => {
    try{
        const res = await axios.get(`${staff}/member/commit`,{headers:{Authorization:`Bearer ${token}`}})
        result.value = res.data
    }catch(err){
        console.error('Error Fething',err)
    }
}

const saveMember = async () =>{
    if(!vaildateForm())return
    try{
        const payload = {
            id_member: form.value.id_member,
            first_name: form.value.first_name,
            last_name: form.value.last_name,
            email: form.value.email,
            username: form.value.username,
            role: form.value.role,
            ...(form.value.password ? {password:form.value.password} : {})
        }
        form.value.id_member
            ? await axios.put(`${staff}/member/${form.value.id_member}`,payload,{headers:{Authorization: `Bearer ${token}`}})
            : await axios.post(`${api}/auth/regis`,{...payload,password:form.value.password})
        alert('ทำรายการสำเร็จ')
        await fetch()
        await reset()
    }catch(err){
        console.error('Error Regis Member!',err)
    }
}

const del = async (id_member:number) => {
    try{
        if(!confirm('ต้องการลบใช่หรือไม่')) return
        await axios.delete(`${staff}/member/${id_member}`,{headers:{Authorization:`Bearer ${token}`}})
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