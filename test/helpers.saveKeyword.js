import test from 'ava';
import {saveKeyword} from '../helpers';

test('saving keyword', t => {
	const dict = {};
	const keyword = 'Joe Rogan';
	saveKeyword(keyword, dict);
	t.is(dict.joerogan.count, 1);
	t.is(dict.joerogan.original, keyword);

	saveKeyword(keyword, dict);
	t.is(dict.joerogan.count, 2);
});
