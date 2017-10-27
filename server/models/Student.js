import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Student = new Schema({
    username: String,
    password: String,
    name: String,
    school: String,
    class: String,
    level: String,
    created: { type: Date, default: Date.now }
});

// generates hash
Student.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, 8);
};

// compares the password
Student.methods.validateHash = function(password) {
    return bcrypt.compareSync(password, this.password);
};

export default mongoose.model('student', Student);