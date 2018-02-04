import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const MemoGroup = new Schema({
	name: String,
	memo: [{
		label: String,
		text: String,
	}]
});
export default mongoose.model('memogroup', MemoGroup);