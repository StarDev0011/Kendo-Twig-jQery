build:
	@echo Building Docker image for NJCDD Web
	docker build . --no-cache --progress plain \
	--tag anthonysw/njcdd-web:1.0 --tag anthonysw/njcdd-web:latest

publish:
	@echo Pushing NJCDD Web
	@docker push anthonysw/njcdd-web:1.0
	@docker push anthonysw/njcdd-web:latest
