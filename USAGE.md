# Note
Until such time as `steamcmd` supports openid auth, this repository will not provide a fully-automated means of fetching Docs.json.

# Setup

1. create a docker volume for the Satisfactory Steam app directory `docker volume create --driver local --opt type=none --opt o=bind --opt device="C:\Program Files (x86)\Steam\steamapps\content\app_526870" steamapps_satisfactory`
	+ if this fails, it'll likely be due to the directory already having contents in it.
1. open in a devcontainer-supporting IDE (e.g. vscode)

# Usage

1. Refer to steps 3-6 of [Temporal_Illusion's Reddit Post](https://www.reddit.com/r/SatisfactoryGame/comments/17ns9oc/info_steam_how_to_download_older_versions_of/) for instructions on how to use `steamcmd` to download old versions of Satisfactory.
1. Refer to [versions.json](./versions.json) or [README.md](./README.md) for the manifest ids needed in step 4
1. For each version of Docs.json required, after step 6 has completed run `make exfiltrate`
	* if successful, you should see that the version you wished to download is listed as `true` in the "currently_installed" column

## Example

![a screengrab of the output of the `make infiltrate` command from this repository, illustrating which supported builds of Satisfactory are listed & which is currently installed (if any- in this case, version 1.1.1.3 is indicated as installed)](./docs/example-make-exfiltrate.png)

# Modifying [versions.json](./versions.json)

1. Refer to [the Satisfactory Wiki's archive of Patch Notes](https://satisfactory.wiki.gg/wiki/Category:Patch_notes) to obtain the version & release date for an unlisted version of Satisfactory.
1. Using the release date obtained in the previous step, refer to steps 1-6 of [Temporal_Illusion's Reddit Post](https://www.reddit.com/r/SatisfactoryGame/comments/17ns9oc/info_steam_how_to_download_older_versions_of/) in order to download an unlisted version of Satisfactory
1. Copy the manifest id and version to `versions.json` as a new entry under `game.windows.builds`
1. Run `make sha512`
1. Copy the sha-512 hex digest of the appropriate file to the new entry you are adding.

## Example

```jsonc
{
	"build": 432215, // Build number copied from the Satisfactory Wiki, required, not currently used
	"steam_manifest_id": "4846844245916086222", // manifest id copied from Steam DB, required
	"version": "1.1.1.3", // version number copied from the Satisfactory Wiki, required
	"update": "1.1", // informational only, required, not currently used
	"file_check": { // an optional entry, but required for exfiltrating Docs.json
		"filename": "FactoryGameSteam.exe", // one of "FactoryGame.exe" or "FactoryGameSteam.exe"
		"sha512": "redacted for brevity" // the sha-512 hex digest of the filename
	},
	"exfiltrate": { // an optional entry, but required for exfiltrating Docs.json
		"CommunityResource": "Docs/*.json" // one of "Docs/Docs.json" or "Docs/*.json"
	}
}
```
