import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const MemoList = new Schema({
	name: String,
	teacher: String,
});
export default mongoose.model('memolist', MemoList);