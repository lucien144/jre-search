import test from 'ava';
import {parseTitle} from '../../cli/helpers';

test('should be false', t => {
	t.false(parseTitle('Another Podcast Title'));
});

test('single host', t => {
	const title = parseTitle('Joe Rogan Experience #144 Jon Jones (part 1)');
	t.is(title.episode, 144);
	t.is(title.hosts[0], 'Jon Jones');
});

test('multiple hosts', t => {
	const title = parseTitle('Joe Rogan Experience #144 Jon Jones, Elon Musk & Niel deGrasse (part 1)');
	t.is(title.hosts.length, 3);
	t.is(title.hosts[0], 'Jon Jones');
	t.is(title.hosts[1], 'Elon Musk');
	t.is(title.hosts[2], 'Niel deGrasse');
});

test('multiple hosts without spaces', t => {
	const title = parseTitle('Joe Rogan Experience #144 Jon Jones,Elon Musk &Niel deGrasse (part 1)');
	t.is(title.hosts.length, 3);
	t.is(title.hosts[0], 'Jon Jones');
	t.is(title.hosts[1], 'Elon Musk');
	t.is(title.hosts[2], 'Niel deGrasse');
});

test('dashes, parts as word and multiple spaces', t => {
	const title = parseTitle('Joe Rogan Experience #165  - Bruce Lipton PHD (PART ONE)');
	t.is(title.hosts.length, 1);
	t.is(title.hosts[0], 'Bruce Lipton PHD');
});

test('mma show', t => {
	const title = parseTitle('JRE MMA Show #41 with TJ Dillashaw & Duane Ludwig');
	t.is(title.episode, 'MMA41');
	t.is(title.hosts.length, 2);
	t.is(title.hosts[0], 'TJ Dillashaw');
	t.is(title.hosts[1], 'Duane Ludwig');
});
