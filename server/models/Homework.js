import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Homework = new Schema({
	title: String,
	content: String,
	files: [String],
	accomplishments: [String],
	dueDate: String,
	writtenDate: String,
	teacherId: String,
});

export default mongoose.model('homework', Homework);
