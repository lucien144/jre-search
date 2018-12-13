import test from 'ava';
import { parseEntities } from '../../cli/helpers';

test('should remove entities from description', t => {
	const description =
		"Tulsi Gabbard is an American politician of the Democratic Party serving as the U.S. Representative for Hawaii's 2nd congressional district since 2013.";
	const dictionary = {};
	t.is(
		parseEntities(description, {}, dictionary),
		" is an  politician of the  serving as the  for 's 2nd congressional district since 2013."
	);
	t.is(dictionary.hawaii.original, 'Hawaii');
	t.is(dictionary.tulsigabbard.original, 'Tulsi Gabbard');
	t.is(dictionary.democraticparty.original, 'Democratic Party');
	t.is(dictionary.usrepresentative.original, 'U.S. Representative');
});
