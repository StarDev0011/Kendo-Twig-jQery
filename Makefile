
# npm version [<newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease | from-git]
bump: bumpby = patch

bump:
	@echo bump the version number
	npm version ${bumpby} -m "Docker Build"
	git push --tags origin main

build: bump
	$(eval $@_build_version := $(shell npm version --json=true | jq ".njcdd"))
	@echo Building Docker image for NJCDD Web
	docker build . --no-cache --pull --progress plain \
	--tag anthonysw/njcdd-web:$($@_build_version) --tag anthonysw/njcdd-web:latest

publish:
	$(eval $@_build_version := $(shell npm version --json=true | jq ".njcdd"))
	@echo Pushing NJCDD Web
	@docker push anthonysw/njcdd-web:$($@_build_version)
	@docker push anthonysw/njcdd-web:latest
