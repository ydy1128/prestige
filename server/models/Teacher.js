import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const Schema = mongoose.Schema;

const Teacher = new Schema({
    username: String,
    password: String,
    name: String,
    classes: [String],
    created: { type: Date, default: Date.now }
});

// generates hash
Teacher.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, 8);
};

// compares the password
Teacher.methods.validateHash = function(password) {
    return bcrypt.compareSync(password, this.password);
};

export default mongoose.model('teacher', Teacher);