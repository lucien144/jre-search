import test from 'ava';
import { parseVideo } from '../../cli/helpers';

const video = require('../data/video.json');

test('should parse video', t => {
	const keywords = {};
	const hosts = {};
	const tags = {};
	parseVideo(video, hosts, keywords, tags);

	t.true(Object.prototype.hasOwnProperty.call(hosts, 'fredmorin'));
	t.true(Object.prototype.hasOwnProperty.call(hosts, 'davidmcmillan'));

	t.is(
		video.title.original,
		'Joe Rogan Experience #1202 - Fred Morin & David McMillan'
	);
	t.is(video.title.episode, 1202);
	t.is(video.title.hosts.length, 2);
	t.is(video.title.hosts[0], 'Fred Morin');
	t.is(video.title.hosts[1], 'David McMillan');
	t.is(video.title.part, null);

	t.is(hosts.fredmorin.count, 1);
	t.is(hosts.fredmorin.original, 'Fred Morin');
	t.is(hosts.fredmorin.videos.length, 1);
	t.is(hosts.fredmorin.videos[0], video);

	t.is(hosts.davidmcmillan.count, 1);
	t.is(hosts.davidmcmillan.original, 'David McMillan');
	t.is(hosts.davidmcmillan.videos[0], video);

	t.is(tags.culinaryadventurists.original, 'culinary adventurists');
	t.is(tags.culinaryadventurists.count, 1);
	t.is(tags.culinaryadventurists.videos[0], video);

	t.is(tags.proprietors.original, 'proprietors');
	t.is(tags.proprietors.count, 1);
	t.is(tags.proprietors.videos[0], video);

	t.is(tags.belovedrestaurant.original, 'beloved restaurant');
	t.is(tags.belovedrestaurant.count, 1);
	t.is(tags.belovedrestaurant.videos[0], video);

	t.is(keywords.jamesbeardaward.original, 'James Beard Award');
	t.is(keywords.jamesbeardaward.count, 1);
	t.is(keywords.jamesbeardaward.videos[0], video);

	t.is(keywords.joebeef.original, 'Joe Beef');
	t.is(keywords.joebeef.count, 1);
	t.is(keywords.joebeef.videos[0], video);

	t.is(keywords.montreal.original, 'Montreal');
	t.is(keywords.montreal.count, 1);
	t.is(keywords.montreal.videos[0], video);

	t.is(keywords[''].original, '–');
	t.is(keywords[''].count, 1);
	t.is(keywords[''].videos[0], video);

	t.is(keywords.culinaryadventurists.original, 'culinary adventurists');
	t.is(keywords.culinaryadventurists.count, 1);
	t.is(keywords.culinaryadventurists.videos[0], video);

	t.is(keywords.proprietors.original, 'proprietors');
	t.is(keywords.proprietors.count, 1);
	t.is(keywords.proprietors.videos[0], video);

	t.is(keywords.belovedrestaurant.original, 'beloved restaurant');
	t.is(keywords.belovedrestaurant.count, 1);
	t.is(keywords.belovedrestaurant.videos[0], video);
});
