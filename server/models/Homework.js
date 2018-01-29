import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Homework = new Schema({
	//_id: String,
	teacherId: String,
	title: String,
	content: String,
	files: [String],
	accomplishments: [String],
	dueDate: String,
	writtenDate: String,
	comments: [String]
});



export default mongoose.model('homework', Homework);