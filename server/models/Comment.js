import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Comment = new Schema({
	writtenDate: String,
	editedDate: String,
	writer: Object,
	content: String,
	homeworkId: String,
	// replies: [String] // ids of comment
})

export default mongoose.model('comment', Comment);