export type PositiveNumber = (
	& number
	& {
		__guard_is_positive_number: never;
	}
);

export type Integer = (
	& number
	& {
		__guard_is_integer: never,
	}
);

export type PositiveInteger = (PositiveNumber & Integer) | 1;

export type PositiveIntegerOrZero = PositiveInteger | 0;

export type ctype_digit = (
	& string
	& {
		__guard_is_ctype_digit: never;
	}
);

export type ctype_xdigit = (
	& string
	& {
		__guard_is_ctype_xdigit: never;
	}
);

export type sha512_hex = (
	& ctype_xdigit
	& {
		length: 128,
	}
);

export type semver<
	Major extends PositiveIntegerOrZero = PositiveIntegerOrZero,
	Minor extends PositiveIntegerOrZero = PositiveIntegerOrZero,
	Patch extends PositiveIntegerOrZero = PositiveIntegerOrZero,
	Build extends PositiveIntegerOrZero = PositiveIntegerOrZero,
> = (
	| `${Major}.${Minor}.${Patch}.${Build}`
	| `${Major}.${Minor}.${Patch}`
	| `${Major}.${Minor}`
);

export type semver_fuzzy<
	Major extends PositiveIntegerOrZero = PositiveIntegerOrZero,
	Minor extends PositiveIntegerOrZero = PositiveIntegerOrZero,
	Patch extends PositiveIntegerOrZero = PositiveIntegerOrZero,
	Build extends PositiveIntegerOrZero = PositiveIntegerOrZero,
> = AtLeastOneOf<{
	major: Major,
	minor: Minor,
	patch: Patch,
	build: Build,
}>;

export type MinimumOneList<T> = [T, ...T[]];

// @see https://stackoverflow.com/a/71131506/1498831
export type AtLeastOneOf<
	T extends object,
	U = {[K in keyof T]: Pick<T, K>}
> = Partial<T> & U[keyof U];
