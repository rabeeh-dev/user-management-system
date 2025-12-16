const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

router.get('/signup',userController.getSignupPage)
router.post('/signup',userController.signup)
router.get('/login',userController.getLoginPage)
router.post('/login',userController.login)

router.get('/logout',(req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            console.log(err)
            return res.send("Error")
        }
        res.clearCookie('connect.sid')
        res.redirect('/login')
    })
})

router.get('/dashboard',(req,res)=>{
    if(!req.session.user){
        return res.render('login',{error:null})
    }else{
        res.render('dashboard',{user:req.session.user})
    }
})


module.exports = router