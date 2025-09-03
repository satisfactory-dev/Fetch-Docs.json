import Ajv from 'ajv/dist/2020.js';
import schema from './versions.schema.json' with {type: 'json'}
import versions from './versions.json' with {type: 'json'}

const ajv = new Ajv({
	strict: true,
});

ajv.validate(schema, versions);

console.log('valid');
