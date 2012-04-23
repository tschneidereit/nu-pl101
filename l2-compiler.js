var letterPitches = {
	'a' : 9,
	'b' : 11,
	'c' : 0,
	'd' : 2,
	'e' : 4,
	'f' : 5,
	'g' : 7
};
var compileExpr = function (time, expr, notes) {
	var compileFun = compilers[expr.tag];
	if (!compileFun)
		throw new Error('unsupported tag: ' + expr.tag);
	return compileFun(time, expr, notes);
};
var compileSeq = function (time, expr, notes) {
	time = compileExpr(time, expr.left, notes);
	return compileExpr(time, expr.right, notes);
};
var compilePar = function (time, expr, notes) {
	var firstEnd = compileExpr(time, expr.left, notes);
	var secondEnd = compileExpr(time, expr.right, notes);
	return Math.max(firstEnd, secondEnd);
};
var compileNote = function (time, expr, notes) {
	notes.push({
		tag : expr.tag, 
		pitch : convertPitch(expr.pitch),
		start : time, 
		dur : expr.dur
	});
	return time + expr.dur;
};
var convertPitch = function (pitch) {
	var letter = pitch.charAt(0);
	var octave = parseInt(pitch.substr(1), 10);
	return 12 + 12 * octave + letterPitches[letter];
}
var compileRest = function (time, expr, notes) {
	notes.push({
		tag : expr.tag,
		start : time,
		dur : expr.dur
	});
	return time + expr.dur;
};
var compileRepeat = function (time, expr, notes) {
	var count = expr.count;
	while (count--) {
		time = compileExpr(time, expr.section, notes);
	}
};
var compilers = {
	'seq' : compileSeq,
	'par' : compilePar,
	'note' : compileNote,
	'rest' : compileRest,
	'repeat' : compileRepeat
};
var compile = function (musexpr) {
	var notes = [];
	compileExpr(0, musexpr, notes);
	return notes;
};
var melody_mus = 
	{
		tag: 'seq',
		left: {
			tag: 'seq',
			left: {
				tag: 'note',
				pitch: 'a4',
				dur: 250
			},
			right: {
				tag: 'note',
				pitch: 'b4',
				dur: 250
			}
		},
		right: {
			tag: 'seq',
			left: {
				tag: 'note',
				pitch: 'c4',
				dur: 500
			},
			right: {
				tag: 'repeat',
				section: {
					tag: 'note',
					pitch: 'c4',
					dur: 250
				},
				count: 3
			}
		}
	};

console.log(melody_mus);
console.log(compile(melody_mus));