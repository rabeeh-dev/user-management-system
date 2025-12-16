const { log } = require('console')
const User = require('../models/user')
const bcrypt = require('bcrypt')

class UserController {

    //signup things start here 

    getSignupPage(req,res){
        res.render('signup',{error : null})
    }

    async signup(req,res){
        const {username , email , password} = req.body

        try{
            const existingUser = await User.findOne({email})

            if(existingUser){
                return res.render('signup',{error : 'email is already registered'})
            }

            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password,salt)

            await User.create({
                username ,
                email , 
                password : hashedPassword,
                role :'user'
            })

            res.redirect('/login')
        }catch(err){
            console.log(err)
            res.render('signup',{error : 'Something went wrong!!'})
        }
    }

    //signup things ends here 

    //login things starts here 

    getLoginPage(req,res){
        res.render('login',{error:null})
    }

    async login(req,res){
        const {email,password} = req.body
        try{
            const user = await User.findOne({email})
            if(!user){
                return res.render('login',{error : 'Invalid Credentials'})
            }

            const isMatch = await bcrypt.compare(password,user.password)

            if(!isMatch){
                return res.render('login',{error : 'Invalid Credentials'})
            }

            req.session.user = {
                id : user._id,
                username : user.username,
                role : user.role
            }

            if(user.role == 'admin'){
                return res.redirect('/admin/dashboard')
            }else{
                if(!req.session.user){
                    return res.redirect('/login')
                }else{
                    return res.redirect('/dashboard')
                }
            }

        }catch(err){
            console.log(err)
            res.render('login',{error : 'Something went wrong try again!'})
        }
    }
}


//login things ends here 


module.exports = new UserController()