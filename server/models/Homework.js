import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Homework = new Schema({
	index: String,
	title: String,
	content: String,
	downloads: [String],
	// uploads: ,
	accomplishments: [String],
	dueDate: String,
	writtenDate: String,
	modifiedDate: String,

	teacherId: String,
});

export default mongoose.model('homework', Homework);
