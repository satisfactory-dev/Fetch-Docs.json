import {
	access,
	readFile,
} from 'node:fs/promises';
import {
	createHash,
} from 'node:crypto';

import Ajv from 'ajv/dist/2020.js';
import type {
	Options,
} from 'ajv/dist/2020.js';

import {
	is_semver,
} from '../assertions.ts';
import type {
	FactoryGameBuildRaw,
	game_update,
	VersionsRaw,
} from './types.ts';

import schema from '../../versions.schema.json' with {type: 'json'};

export function is_game_update(
	value: number|string,
): asserts value is game_update {
	if (
		!(
			(
				'number' === typeof value
				&& Number.isSafeInteger(value)
				&& value >= 3
				&& value <= 8
			)
			|| (
				'string' === typeof value
				&& is_semver(value, {major: 1})
			)
		)
	) {
		throw new TypeError('Update unsupported!');
	}
}

export type AjvOptions = (
	& Options
	& {strict: true}
);

export const ajv_options_default:AjvOptions = {
	strict: true,
};

export function is_VersionsRaw(
	value: object,
	options: AjvOptions = ajv_options_default,
): asserts value is VersionsRaw {
	const ajv = new Ajv(options);

	const validator = ajv.compile<VersionsRaw>(schema);

	if (!validator(value)) {
		throw new TypeError('Data not matched with a supported schema!');
	}
}

function exists(filepath: string): Promise<boolean> {
	return access(filepath).then(() => true).catch(() => false);
}

export async function version_exists(
	app_id: VersionsRaw['game']['windows']['app_id'],
	depot_id: VersionsRaw['game']['windows']['depot_id'],
	file_check?: FactoryGameBuildRaw['file_check'],
): Promise<boolean> {
	if (undefined === file_check) {
		return false;
	}

	const {
		filename,
		sha512,
	} = file_check;

	if (
		'FactoryGame.exe' === filename
		&& await exists(`/app/steamapps/app_${app_id}/depot_${depot_id}/FactoryGameSteam.exe`)
	) {
		return false;
	}

	const filepath = `/app/steamapps/app_${app_id}/depot_${depot_id}/${filename}`;

	if (!await exists(filepath)) {
		return false;
	}

	const file = await readFile(filepath);

	const hash = createHash('sha512');
	hash.update(file);

	const result = sha512 === hash.digest('hex');

	hash.destroy();

	return result;
}
