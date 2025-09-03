import {
	AtLeastOneOf,
	ctype_digit,
	MinimumOneList,
	PositiveInteger,
	PositiveIntegerOrZero,
	semver,
	sha512_hex,
} from '../types.ts';

export type game_update = (
	| 3
	| 4
	| 5
	| 6
	| 7
	| 8
	| (
		& semver<(1 & PositiveInteger)>
		& `1.${PositiveIntegerOrZero}`
	)
);

type BuildRaw<
	Filename extends string
> = {
	build: PositiveInteger;
	experimental: boolean;
	steam_manifest_id: ctype_digit;
	update: game_update;
	version: semver;
	file_check?: (
		& {
			filename: Filename,
		}
		& AtLeastOneOf<{
			sha512: sha512_hex,
		}>
	),
};

export type FactoryGameBuildRaw = (
	& BuildRaw<'FactoryGame.exe'>
	& {
		exfiltrate?: {
			CommunityResource: (
				| `Docs/${'*'|'Docs'}.json`
			),
		},
	}
);

type PlatformRaw<
	Platforms extends string = string,
	Build extends BuildRaw<string> = BuildRaw<string>,
> = {
	[k in Platforms]: {
		app_id: ctype_digit,
		depot_id: ctype_digit,
		builds: MinimumOneList<Build>,
	};
};

export type VersionsRaw = {
	[k: string]: PlatformRaw,
	game: PlatformRaw<'windows', FactoryGameBuildRaw>,
};
