import test from 'ava';
import { parseQuotes } from '../../cli/helpers';

test('parsing double quotes', t => {
	const dictionary = {};
	const result = parseQuotes(
		'This is a testing "double quotes".',
		dictionary
	);
	t.is(result, 'This is a testing .');
	t.is(dictionary.doublequotes.original, 'double quotes');
	t.is(dictionary.doublequotes.count, 1);
});

test('parsing single quotes', t => {
	const dictionary = {};
	const result = parseQuotes(
		"This is a testing 'single quotes'.",
		dictionary
	);
	t.is(result, 'This is a testing .');
	t.is(dictionary.singlequotes.original, 'single quotes');
	t.is(dictionary.singlequotes.count, 1);
});

test('parsing mix quotes', t => {
	const dictionary = {};
	const result = parseQuotes(
		'This is a test of "double and" \'single quotes\'.',
		dictionary
	);
	t.is(result, 'This is a test of  .');
	t.is(dictionary.doubleand.original, 'double and');
	t.is(dictionary.doubleand.count, 1);
	t.is(dictionary.singlequotes.original, 'single quotes');
	t.is(dictionary.singlequotes.count, 1);
});
