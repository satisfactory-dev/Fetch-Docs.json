import {
	is_ctype_digit,
	is_min1LengthArray,
	is_PositiveInteger,
	is_semver,
} from '../assertions.ts';
import type {
	ctype_digit,
	MinimumOneList,
	PositiveInteger,
	PositiveIntegerOrZero,
	semver,
} from '../types.ts';
import schema from '../../versions.schema.json' with {type: 'json'};
import type {
	AjvOptions,
} from './assertions.ts';
import {
	ajv_options_default,
	is_game_update,
	is_VersionsRaw,
	version_exists,
} from './assertions.ts';
import type {
	FactoryGameBuildRaw,
	game_update,
	VersionsRaw,
} from './types.ts';

export class Build<
	semver_Major extends PositiveIntegerOrZero = PositiveIntegerOrZero,
	semver_Minor extends PositiveIntegerOrZero = PositiveIntegerOrZero,
	semver_Patch extends PositiveIntegerOrZero = PositiveIntegerOrZero,
	semver_Build extends PositiveIntegerOrZero = PositiveIntegerOrZero,
> {
	readonly build: PositiveInteger;
	readonly currently_installed: boolean;
	readonly exfiltrate: FactoryGameBuildRaw['exfiltrate'];
	readonly experimental: boolean;
	readonly steam_manifest_id: ctype_digit;
	readonly update: game_update;
	readonly version: semver<
		semver_Major,
		semver_Minor,
		semver_Patch,
		semver_Build
	>;

	private constructor(
		build: PositiveInteger,
		steam_manifest_id: ctype_digit,
		semver: semver<
			semver_Major,
			semver_Minor,
			semver_Patch,
			semver_Build
		>,
		update: game_update,
		experimental: boolean = false,
		currently_installed: boolean = false,
		exfiltrate?: Exclude<Build['exfiltrate'], undefined>,
	) {
		this.build = build;
		this.steam_manifest_id = steam_manifest_id;
		this.version = semver;
		this.update = update;
		this.experimental = experimental;
		this.currently_installed = currently_installed;
		this.exfiltrate = exfiltrate;
	}

	static async from_BuildRaw(
		app_id: VersionsRaw['game']['windows']['app_id'],
		depot_id: VersionsRaw['game']['windows']['depot_id'],
		{
			build,
			experimental,
			steam_manifest_id,
			version,
			update,
			file_check,
			exfiltrate,
		}: FactoryGameBuildRaw,
		skip_file_check = false,
	): Promise<Build> {
		const currently_installed = (
			skip_file_check
				? false
				: await version_exists(app_id, depot_id, file_check)
		);

		return new this(
			build,
			steam_manifest_id,
			version,
			update,
			experimental,
			currently_installed,
			exfiltrate,
		);
	}

	static fuzzy<
		semver_Major extends (
			| PositiveIntegerOrZero
			| undefined
		) = PositiveIntegerOrZero,
		semver_Minor extends (
			| PositiveIntegerOrZero
			| undefined
		) = PositiveIntegerOrZero,
		semver_Patch extends (
			| PositiveIntegerOrZero
			| undefined
		) = PositiveIntegerOrZero,
		semver_Build extends (
			| PositiveIntegerOrZero
			| undefined
		) = PositiveIntegerOrZero,
	> (
		build: number,
		steam_manifest_id: string,
		semver: string,
		update: number|string,
		experimental: boolean = false,
		semver_fuzzy: undefined|(
			(
				semver_Major extends undefined
					? (
						semver_Minor extends undefined
							? (
								semver_Patch extends undefined
									? (
										semver_Build extends undefined
											? undefined
											: {
												build: semver_Build,
											}
									)
									: (
										semver_Build extends undefined
											? {
												patch: semver_Patch,
											}
											: {
												patch: semver_Patch,
												build: semver_Build,
											}
									)
							)
							: (
								semver_Patch extends undefined
									? (
										semver_Build extends undefined
											? {
												minor: semver_Minor,
											}
											: {
												minor: semver_Minor,
												build: semver_Build,
											}
									)
									: (
										semver_Build extends undefined
											? {
												minor: semver_Minor,
												patch: semver_Patch,
											}
											: {
												minor: semver_Minor,
												patch: semver_Patch,
												build: semver_Build,
											}
									)
							)
					)
					: (
						semver_Minor extends undefined
							? (
								semver_Patch extends undefined
									? (
										semver_Build extends undefined
											? {
												major: semver_Major,
											}
											: {
												major: semver_Major,
												build: semver_Build,
											}
									)
									: (
										semver_Build extends undefined
											? {
												major: semver_Major,
												patch: semver_Patch,
											}
											: {
												major: semver_Major,
												patch: semver_Patch,
												build: semver_Build,
											}
									)
							)
							: (
								semver_Patch extends undefined
									? (
										semver_Build extends undefined
											? {
												major: semver_Major,
												minor: semver_Minor,
											}
											: {
												major: semver_Major,
												minor: semver_Minor,
												build: semver_Build,
											}
									)
									: (
										semver_Build extends undefined
											? {
												major: semver_Major,
												minor: semver_Minor,
												patch: semver_Patch,
											}
											: {
												major: semver_Major,
												minor: semver_Minor,
												patch: semver_Patch,
												build: semver_Build,
											}
									)
							)
					)
			)
		) = undefined,
	): Build<
		Exclude<semver_Major, undefined>,
		Exclude<semver_Minor, undefined>,
		Exclude<semver_Patch, undefined>,
		Exclude<semver_Build, undefined>
	> {
		is_PositiveInteger(build);

		if (build < schema.$defs.build.properties.build.minimum) {
			throw new TypeError('Build number too low!');
		}

		is_ctype_digit(steam_manifest_id);

		is_semver<
			Exclude<semver_Major, undefined>,
			Exclude<semver_Minor, undefined>,
			Exclude<semver_Patch, undefined>,
			Exclude<semver_Build, undefined>
		>(semver, semver_fuzzy);

		is_game_update(update);

		return new this<
			Exclude<semver_Major, undefined>,
			Exclude<semver_Minor, undefined>,
			Exclude<semver_Patch, undefined>,
			Exclude<semver_Build, undefined>
		>(
			build,
			steam_manifest_id,
			semver,
			update,
			experimental,
		);
	}

	static async get_versions(
		data: object,
		options: AjvOptions = ajv_options_default,
	): Promise<MinimumOneList<Build>> {
		is_VersionsRaw(data, options);

		const result:Build[] = [];

		let skip_file_check = false;

		for (const build of data.game.windows.builds) {
			const converted = await this.from_BuildRaw(
				data.game.windows.app_id,
				data.game.windows.depot_id,
				build,
				skip_file_check,
			);

			skip_file_check = skip_file_check || converted.currently_installed;

			result.push(converted);
		}

		is_min1LengthArray<Build>(result);

		return result;
	}
}
