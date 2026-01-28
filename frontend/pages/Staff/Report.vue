<template>
    <v-container fluid class="py-10">
                <v-card>
                    <v-sheet class="pa-4">
                        <h1 class="text-h5 text-center font-weight-bold">รายงานผล</h1><br>
                        <v-table>
                            <thead>
                                <tr>
                                    <th class="text-center border">ลำดับ</th>
                                    <th class="text-center border">รายงาน</th>
                                    <th class="text-center border">รายละเอียด</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="text-center border">1</td>
                                    <td class="text-center border">ผู้รับการประเมินทั้งหมด</td>
                                    <td class="text-center border">
                                        <nuxt-link to="/Staff/ReEva">
                                            <v-btn class="text-center" color="warning" prepend-icon="mdi-file-document" size="small">รายละเอียด</v-btn>
                                        </nuxt-link>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="text-center border">2</td>
                                    <td class="text-center border">กรรมการประเมินทั้งหมด</td>
                                    <td class="text-center border">
                                        <nuxt-link to="/Staff/ReCommit">
                                            <v-btn class="text-center" color="warning" prepend-icon="mdi-file-document" size="small">รายละเอียด</v-btn>
                                        </nuxt-link>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="text-center border">3</td>
                                    <td class="text-center border">รายงานผลการประเมินที่สำเร็จ</td>
                                    <td class="text-center border">
                                        <nuxt-link to="/Staff/ReY">
                                            <v-btn class="text-center" color="warning" prepend-icon="mdi-file-document" size="small">รายละเอียด</v-btn>
                                        </nuxt-link>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="text-center border">3</td>
                                    <td class="text-center border">รายงานผลการประเมินที่ไม่สำเร็จ</td>
                                    <td class="text-center border">
                                        <nuxt-link to="/Staff/ReN">
                                            <v-btn class="text-center" color="warning" prepend-icon="mdi-file-document" size="small">รายละเอียด</v-btn>
                                        </nuxt-link>
                                    </td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-sheet>
                    <v-card-text>
                    </v-card-text>
                </v-card>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios'
import {api,staff} from '../../API/base'

const token = process.client ? localStorage.getItem('token') : null

const result = ref([])
const box = ref([])
const box2 = ref([])

</script>

<style scoped>
.text-maroon{
    color: #7d0c14;
}
</style>