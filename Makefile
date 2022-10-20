
# npm version [<newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease | from-git]
bump: bumpby = patch

bump:
	@echo bump the version number
	npm version ${bumpby} -m "Docker Build"
	git push --tags origin main

rebuild:
	$(eval $@_build_version := $(shell npm version --json=true | jq ".account_njcdd" | tr -d '"'))
	@echo Building Docker image for NJCDD Web
	docker build . --no-cache --pull --progress plain \
	--tag anthonysw/njcdd-web:$($@_build_version) --tag anthonysw/njcdd-web:latest

build: bump rebuild

publish:
	$(eval $@_build_version := $(shell npm version --json=true | jq ".njcdd" | tr -d '"'))
	@echo Pushing NJCDD Web
	@docker push anthonysw/njcdd-web:$($@_build_version)
	@docker push anthonysw/njcdd-web:latest
