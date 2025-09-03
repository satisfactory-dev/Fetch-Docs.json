import {
	copyFile,
	glob,
	mkdir,
} from 'node:fs/promises';
import {
	dirname,
	relative,
} from 'node:path';

import {
	Build,
} from './src/game/Build.ts';

import versions from './versions.json' with {type: 'json'};

const result = await Build.get_versions(versions);

const {
	app_id,
	depot_id,
} = versions.game.windows;

const community_resources_path = `/app/steamapps/app_${app_id}/depot_${depot_id}/CommunityResources`;

for (const build of result) {
	if (build.currently_installed && build.exfiltrate) {
		const {
			CommunityResource,
		} = build.exfiltrate;

		const glob_path = `${community_resources_path}/${CommunityResource}`;

		for await (const filepath of glob(glob_path)) {
			const exfiltration_filepath = `${
				import.meta.dirname
			}/data/game/windows/${
				build.version
			}/${
				relative(community_resources_path, filepath)
			}`;

			await mkdir(dirname(exfiltration_filepath), {
				recursive: true,
			});
			await copyFile(filepath, exfiltration_filepath);
		}
	}
}

console.table(result);
