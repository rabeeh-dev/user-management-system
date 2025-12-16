const bcrypt = require('bcrypt');
const User = require('../models/user')
const ADMIN = {
    username : "admin",
    password : "123"
}

class AdminController{
    getLogin(req,res){
        res.render('admin-login',{error:null})
    }
    postLogin(req,res){
        const {username , password} = req.body
        if(username === ADMIN.username && password === ADMIN.password){
            req.session.admin = true
            res.redirect('/admin/dashboard')
        }else{
            res.render('admin-login',{error: 'Invalid credintials'})
        }
    }

    
    async getDashboard(req, res) {
        try {
            let query = {};
            if (req.query.search) {
                query = {
                    $or: [
                        { username: { $regex: req.query.search, $options: 'i' } },
                        { email: { $regex: req.query.search, $options: 'i' } }
                    ]
                };
            }

            
            const users = await User.find(query);

            
            res.render('admin-dashboard', { 
                users: users, 
                adminName: "Super Admin" 
            });

        } catch (error) {
            console.log(error);
            res.send("Error loading dashboard");
        }
    }

    // 4. Render Edit User Page
    async getEditUserPage(req, res) {
        try {
            const user = await User.findById(req.params.id);
            res.render('edit-user', { user: user, error: null });
        } catch (error) {
            console.log(error);
            res.redirect('/admin/dashboard');
        }
    }

    async updateUser(req, res) {
        try {
            const { username, email, role } = req.body;
            
            await User.findByIdAndUpdate(req.params.id, {
                username: username,
                email: email,
                role: role
            });

            res.redirect('/admin/dashboard');
        } catch (error) {
            console.log(error);
            res.redirect(`/admin/edit-user/${req.params.id}`);
        }
    }

    async deleteUser(req,res){
        try{
            const {id} = req.params 
            await User.findByIdAndDelete(id)
            res.redirect('/admin/dashboard')
        }catch(err){
            console.log(err)
            res.redirect('/admin/dashboard')
        }
    }

    getCreatePage(req,res){
        res.render('new-user',{error:null})
    }

    async createUser(req, res) {
    try {
        const { username, email, password, role } = req.body;

        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('admin/create-user', { error: 'Email already exists' });
        }

        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        
        await User.create({
            username,
            email,
            password: hashedPassword,
            role
        });

        res.redirect('/admin/dashboard');

    } catch (error) {
        console.log(error);
        res.render('admin/create-user', { error: 'Something went wrong' });
    }
}




    logout(req,res){
         req.session.destroy((err)=>{
        if(err){
            console.log(err)
            return res.send("Error")
        }
        res.clearCookie('connect.sid')
        res.redirect('/admin/login')
    })
    }



}



module.exports = new AdminController()