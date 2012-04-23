var PEG = require('pegjs');
var assert = require('should');
var fs = require('fs');

// Read file contents
var data = fs.readFileSync('l3-scheeme-grammar.peg', 'utf-8');
// Create my parser
var parse = PEG.buildParser(data).parse;

//tests
assert.deepEqual( parse("a"), ["a"] ); //parse atoms
assert.deepEqual( parse("(a b c)"), [["a", "b", "c"]] ); //parse atom lists
assert.deepEqual( parse("(a b (c d))"), [["a", "b", ["c", "d"]]] ); //parse nested atom lists
assert.deepEqual( parse(" (     a b\n  c)"), [["a", "b", "c"]] ); //ignore whitespace
assert.deepEqual( parse("a;;comment\nb"), ["a", "b"] ); //ignore comments at EOL after expression
assert.deepEqual( parse("a;;comment"), ["a"] ); //ignore comments at EOF after expression
assert.deepEqual( parse(";;comment\na"), ["a"] ); //ignore comments at beginning of line