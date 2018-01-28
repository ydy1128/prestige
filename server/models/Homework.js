import mongoose from 'mongoose';

const Schema = mongoose.Schema;


const Comment = new Schema({
	id: String,
	name: String,
	type: String, // teacher or student
	content: String
})

const Homework = new Schema({
	//_id: String,
	teacherId: String,
	title: String,
	content: String,
	files: [String],
	accomplishments: [String],
	dueDate: String,
	writtenDate: String,
	comments: [Object]
});



export default mongoose.model('homework', Homework);