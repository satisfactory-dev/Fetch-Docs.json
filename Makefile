lint--json:
	@node ./validate-versions.ts

lint--ts:
	@./node_modules/.bin/tsc --project ./tsconfig.json
	@./node_modules/.bin/eslint --cache './**/*.ts'

lint: lint--ts lint--json

exfiltrate: lint--ts
	node ./exfiltrate.ts

sha512:
	@sha512sum -b /app/steamapps/app_526870/depot_526871/FactoryGame.exe
	@sha512sum -b /app/steamapps/app_526870/depot_526871/FactoryGameSteam.exe

update-readme:
	@node ./update-readme.ts
