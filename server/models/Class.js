import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Class = new Schema({
	name: String,
	teacher: String,
	students: [String],
	startTime: String,
	endTime: String,
	days: String
});

export default mongoose.model('class', Class);