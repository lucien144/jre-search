import test from 'ava';
import {parseTitle} from '../helpers';

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