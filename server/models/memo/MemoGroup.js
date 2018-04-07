import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const MemoGroup = new Schema({
	name: String,
	teacher: String,
	memoList: String,
	memos: [{
		text: String,
		label: String,
		dueDate: String,
		memoGroup: String,
		// attachment: String,
	}]
});
export default mongoose.model('memogroup', MemoGroup);