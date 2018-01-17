ESLINT=./node_modules/.bin/eslint
TAP=./node_modules/.bin/tap

# ------------------------------------------------------------------------------

start:
	node server.js

# ------------------------------------------------------------------------------

lint:
	$(ESLINT) ./*.js
	$(ESLINT) ./lib/*.js
	$(ESLINT) ./test/**/*.js

tap-tests:
	$(TAP) ./test/{unit,functional,integration}/*.js

test:
	@make lint
	@make tap-tests

coverage:
	$(TAP) ./test/{unit,functional,integration}/*.js --coverage --coverage-report=lcov

.PHONY: start lint test coverage load
