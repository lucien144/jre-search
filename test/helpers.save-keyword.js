import test from 'ava';
import {saveKeyword} from '../helpers';

test('saving keyword', t => {
	const dict = {};
	const keyword = 'Joe Rogan';
	saveKeyword(keyword, dict, {});
	t.is(dict.joerogan.count, 1);
	t.is(dict.joerogan.original, keyword);
	t.is(dict.joerogan.videos.length, 1);

	saveKeyword(keyword, dict, {});
	t.is(dict.joerogan.count, 2);
	t.is(dict.joerogan.videos.length, 2);

	saveKeyword(' Joe rogan ', dict, {});
	t.is(dict.joerogan.original, keyword, 'Testing case insensitivity + trim');
	t.is(dict.joerogan.count, 3);
	t.is(dict.joerogan.videos.length, 3);
});

test('should be trimmed', t => {
	const dict = {};
	saveKeyword(' Joe Rogan ', dict, {});
	t.is(dict.joerogan.original, 'Joe Rogan');
});
