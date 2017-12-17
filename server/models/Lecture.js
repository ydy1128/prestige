import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Lecture = new Schema({
	name: String,
	link: String,
	teacher: String,
	class: String,
	accomplishments: [{
		_id: String,
		accomplishments: Number
	}],
	date: String
});
export default mongoose.model('lecture', Lecture);