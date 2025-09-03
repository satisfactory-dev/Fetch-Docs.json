import type {
	ctype_digit,
	ctype_xdigit,
	Integer,
	MinimumOneList,
	PositiveInteger,
	PositiveIntegerOrZero,
	PositiveNumber,
	semver,
	semver_fuzzy,
	sha512_hex,
} from './types.ts';

export function is_Integer(
	value: number,
): asserts value is Integer {
	if (!Number.isSafeInteger(value)) {
		throw new TypeError('Value was not an integer!');
	}
}

export function is_Positive(
	value: number,
): asserts value is PositiveNumber {
	if (isNaN(value)) {
		throw new TypeError('Value must not be NaN!');
	}
	if (value <= 0) {
		throw new TypeError('Value must be greater than zero!');
	}
}

export function is_PositiveInteger(
	value: number,
): asserts value is PositiveInteger {
	is_Integer(value);
	is_Positive(value);
}

export function is_PositiveIntegerOrZero(
	value: number,
): asserts value is PositiveIntegerOrZero {
	is_Integer(value);

	if (value < 0) {
		throw new TypeError('Value must be greater than or equal to zero!');
	}
}

export function is_ctype_digit(
	value: string,
): asserts value is ctype_digit {
	if (!/^\d+$/.test(value)) {
		throw new TypeError('Value must be a numeric string!');
	}
}

export function is_ctype_xdigit(
	value: string,
): asserts value is ctype_xdigit {
	if (!/^[0-9a-f]+$/.test(value)) {
		throw new TypeError('Value must be a hexadeicmal string!');
	}
}

export function is_sha512_hex(
	value: string,
): asserts value is sha512_hex {
	is_ctype_xdigit(value);

	if (128 !== value.length) {
		throw new TypeError(
			'Value must be a 128-character hexadecimal string!',
		);
	}
}

export function is_semver<
	Major extends PositiveIntegerOrZero = PositiveIntegerOrZero,
	Minor extends PositiveIntegerOrZero = PositiveIntegerOrZero,
	Patch extends PositiveIntegerOrZero = PositiveIntegerOrZero,
	Build extends PositiveIntegerOrZero = PositiveIntegerOrZero,
>(
	value: string,
	fuzzy: undefined|semver_fuzzy = undefined,
): asserts value is semver<
	Major,
	Minor,
	Patch,
	Build
> {
	if (fuzzy) {
		const {
			major,
			minor,
			patch,
			build,
		} = fuzzy;

		const has_build = `(\\.${
			undefined !== build
				? build
				: '\\d+'
		})`;
		const has_patch = `(\\.${
			undefined !== patch
				? patch
				: '\\d+'
		}${has_build})?`;
		const has_minor = `(\\.${
			undefined !== minor
				? minor
				: '\\d+'
		}${has_patch})?`;

		if ((new RegExp(`^\\.${
			undefined !== major
				? major
				: '\\d+'
		}${has_minor}$`)).test(value)) {
			throw new TypeError('Value does not match constraint!');
		}
	} else if (!/^\d+(\.\d+){1,3}$/.test(value)) {
		throw new TypeError('Value must be a supported semver!');
	}
}

export function is_min1LengthArray<T>(
	value:T[],
): asserts value is MinimumOneList<T> {
	if (value.length < 1) {
		throw new TypeError('Value must be an array of at least 1 element!');
	}
}
