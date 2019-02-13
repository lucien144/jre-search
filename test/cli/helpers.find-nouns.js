import test from 'ava';
import { findNouns } from '../../cli/helpers';

test('finding adjective with noun', t => {
	const description = 'Dr. Bruce Damer is a polymath scientist.';
	const dictionary = {};
	findNouns(description, dictionary, {});
	t.is(dictionary.polymathscientist.original, 'polymath scientist');
});

test('finding multiple nouns and adjective nouns', t => {
	const description =
		'Dr. Bruce Damer is a designer, author and general explorer of liminal realms.';
	const dictionary = {};
	findNouns(description, dictionary, {});
	t.is(dictionary.designer.original, 'designer');
	t.is(dictionary.author.original, 'author');
	t.is(dictionary.generalexplorer.original, 'general explorer');
	t.is(dictionary.liminalrealms.original, 'liminal realms');
});

test('finding plural nouns', t => {
	const description =
		'He has worked for over a decade in simulation and design of space missions for NASA, develops biochemical models for the origin of life at UC Santa Cruz and collects vintage computers and their history in his DigiBarn computer museum.';
	const dictionary = {};
	findNouns(description, dictionary, {});
	t.is(dictionary.spacemissions.original, 'space missions');
	t.is(dictionary.biochemicalmodels.original, 'biochemical models');
});

test('should avoid entities', t => {
	const description =
		'Dr. Bruce Damer worked for over a decade in simulation and design of space missions for NASA, develops biochemical models for the origin of life at UC Santa Cruz and collects vintage computers and their history in his DigiBarn computer museum.';
	const dictionary = {};
	findNouns(description, dictionary, {});
	t.true(dictionary.nasa === undefined);
	t.true(dictionary.digibarn === undefined);
});

test('should avoid duplicated nouns', t => {
	const description =
		'Dr. Bruce Damer is a comedian and his friend Bruce Banner is also comedian.';
	const dictionary = {};
	findNouns(description, dictionary, { video: 'test' });
	t.is(dictionary.comedian.videos.length, 1);
});
