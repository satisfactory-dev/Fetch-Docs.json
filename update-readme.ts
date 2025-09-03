import {
	writeFile,
} from 'fs/promises';

import versions from './versions.json' with {type: 'json'};

const {
	app_id,
	depot_id,
	builds,
} = versions.game.windows;

let readme = `# Usage/Modification${
		'\n'
	}If you wish to contribute/modify/run the underlying etc.,${
		''
	} refer to [CONTRIBUTING.md](./CONTRIBUTING.md) and [USAGE.md](./USAGE.md)${
		'\n'
	}# [License](./LICENSE.md)${
		'\n'
	}* Code is licensed under Apache 2.0${
		'\n'
	}* [README.md](./README.md) is licensed as [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)${
		''
	} for usage on the the [Satisfactory Wiki](https://satisfactory.wiki.gg/)${
		'\n\n'
	} # Downloading old versions of Satisfactory${
		'\n'
	}If you only want to download old versions of Satisfactory,${
		''
	} refer to the table below and steps 3-9 of${
		''
	} [Temporal_Illusion's Reddit Post](https://www.reddit.com/r/SatisfactoryGame/comments/17ns9oc/info_steam_how_to_download_older_versions_of/)${
		''
	} for instructions on how to use \`steamcmd\` to download old versions of Satisfactory.${
		'\n\n'
	}| Update | Version | Command |${
		'\n'
	}| --- | --- | --- |${
		'\n'
	}`;

for (const build of builds.toSorted((a, b) => {
	return b.version.localeCompare(a.version);
})) {
	readme += `| ${
		build.update
	} | ${
		build.version
	} | \`download_depot ${
		app_id
	} ${
		depot_id
	} ${
		build.steam_manifest_id
	}\` |${
		'\n'
	}`;
}

await writeFile(`${import.meta.dirname}/README.md`, readme);

console.log('Updated README.md');
