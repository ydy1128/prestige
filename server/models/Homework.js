import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Homework = new Schema({
	//_id: String,
	teacherId: String,
	title: String,
	content: String,
	fileNames: [String],
	accomplishments: [String],
	dueDate: String,
	writtenDate: String,
	classId: String
});



export default mongoose.model('homework', Homework);