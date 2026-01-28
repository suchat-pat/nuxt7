const express = require('express')
const bc = require('bcryptjs')
const path = require('path')
const fs = require('fs')
const uploadDir = path.join(__dirname,'../../uploads/signature')
const router = express.Router()
const db = require('../../db')
const {verifyToken,requireRole} = require('../../middleware/authMiddleware')

// ============= demo ===============
// API สำหรับ Get ข้อมูล
// router.get('/eva',verifyToken,requireRole('กรรมการประเมิน'),async (req,res) => {
//     try{
//         const [rows] = await db.query(``)
//         res.json(rows)
//     }catch(err){
//         console.error('Error Get',err)
//         res.status(500).json({message:'Error Get'})
//     }
// })
// ============= demo ===============

// API สำหรับ Get ข้อมูล
router.get('/:id_eva',verifyToken,requireRole('กรรมการประเมิน'),async (req,res) => {
    try{
        const id_member = req.user.id_member
        const id_eva = req.params.id_eva
        const [rows] = await db.query(
            `select * from tb_member m,tb_eva e,tb_system s,tb_commit c where c.id_member=? and c.id_eva=? and e.status_eva in (2,3) and c.id_eva=e.id_eva and e.id_member=m.id_member and e.id_sys=s.id_sys order by e.id_eva desc`,
            [id_member,id_eva]
        )
        res.json(rows[0])
    }catch(err){
        console.error('Error GET Member',err)
        res.status(500).json({message:'Error GET Member'})
    }
})

// API สำหรับ upload ข้อมูล
router.post('/:id_eva',verifyToken,requireRole('กรรมการประเมิน'),async (req,res) => {
    try{
        const file = req.files?.file
        const id_member = req.user.id_member
        const id_eva = req.params.id_eva
        const filename = Date.now() + path.extname(file.name).toLowerCase()
        await file.mv(path.join(uploadDir,filename))
        await db.query(`update tb_commit set signature=? where id_member=? and id_eva=?`,[filename,id_member,id_eva])
        res.status(201).json({message:'Upload Success'})
    }catch(err){
        console.error('Error Upload',err)
        res.status(500).json({message:'Error Upload'})
    }
})

// API สำหรับ Delte ข้อมูล
router.delete('/:id_eva',verifyToken,requireRole('กรรมการประเมิน'),async (req,res) => {
    try{
        const id_member = req.user.id_member
        const id_eva = req.params.id_eva
        const [[D]] = await db.query(`select signature from tb_commit where id_member=? and id_eva=?`,[id_member,id_eva])
        const fp = path.join(uploadDir,D.signature)
        if(fs.existsSync(fp)){
            fs.unlinkSync(fp)
        }
        await db.query(`update tb_commit set signature=? where id_member=? and id_eva=?`,[null,id_member,id_eva])
        res.json({message:'Delete Success'})
    }catch(err){
        console.error('Error Delete',err)
        res.status(500).json({message:'Error Delete'})
    }
})

module.exports = router