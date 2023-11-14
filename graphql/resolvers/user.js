const User = require('../../models/Message');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {ApolloError} = require('apollo-server');

module.exports = {
    Mutation: {
        async registerUser(_, {registerInput: {username, email, password} }) {
            //check if user exists
            
           let user = await User.findOne({ email});
           if (user) {
              throw new ApolloError('User already exists');
            }
        
       
                 //hash password
        
                 const saltRounds = 10;
                 const salt = await bcrypt.genSalt(saltRounds);
                 const hashedpassword = await bcrypt.hash(password, salt);
        
            //build user object
            user = new User({
                name: username,
                email: email.toLowerCase(),
                password:hashedpassword
            });
            console.log("user:",user);

                  //create token
            const token = jwt.sign({
                user_id: user._id,
                email
            }, process.env.SECRET_KEY, { expiresIn: '1h' });

            user.token = token;
        
            //save user
            user = await user.save();
            
            //return user
            return {
                ...user._doc,
                id: user._id,
                token
        }
        },
        async loginUser(_, {loginInput: {email, password} }) {
            //check if user exists
            let user = await User.findOne({ email});
            if (!user) {
                throw new ApolloError('User does not exist');
            }
            //check if password is correct
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                throw new ApolloError('Invalid password');
            }
            //create token
            const token = jwt.sign({
                user_id: user._id,
                email
            }, process.env.SECRET_KEY, { expiresIn: '1h' });

            //attach token to the user 
            user.token = token;
            //return user
            return {
                ...user._doc,
                id: user._id,
                token
            }
        }
},
    Query: {
      
        user:(_, {ID})=> {
            User.findById(ID) 
                .then(user => {
                    return user;
                })
                .catch(err => {
                    throw new Error(err);
                });
    }
}
}






