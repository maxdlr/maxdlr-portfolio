# Variables
# Basic Symfony/Webapp Makefile by Maxdlr
default: help

APP = MAXDLR

SYMFONY = symfony console
MYSQL_USERNAME = root
MYSQL_PASSWORD = root
MYSQL_HOST = 127.0.0.1
MYSQL_PORT = 3307
BLUE_COLOR=\033[0;36m
YELLOW_COLOR=\033[0;33m
SUCCESS_COLOR=\033[0;32m
END_COLOR=\033[0m

run: ## Start project
	@make recipe-intro-msg msg="Starting project"

	@make create-local-env && \
	clear && \
	make composer-install && \
	clear && \
	make db && \
	clear && \
	make yarn-install && \
	make yarn-build && \
	make cache-clear && \
	clear && \
	make server-start && \
	clear && \
	make open-browser && \
	make success-msg


command-intro-msg:
	@echo "[$(BLUE_COLOR)$(APP)$(END_COLOR)] -------------$(SUCCESS_COLOR)|=>$(END_COLOR) $(YELLOW_COLOR)$(msg)... $(END_COLOR)"
recipe-intro-msg:
	@echo "[$(BLUE_COLOR)$(APP)$(END_COLOR)] -- $(YELLOW_COLOR)[ ------------- $(msg)... ------------- ]$(END_COLOR)"
success-msg:
	@echo "[$(BLUE_COLOR)$(APP)$(END_COLOR)] -- $(SUCCESS_COLOR)[OK]$(END_COLOR)"

db: ## Create or Reload Database
	@make recipe-intro-msg msg="Reloading database"
	@make db-drop && \
	make db-create && \
	make db-migrate && \
	make db-migration && \
	make db-migrate && \
	make db-fixtures && \
	make success-msg

yarn-build: ## Building public assets
	@make command-intro-msg msg="Building public assets"
	@yarn build

open-browser: ## Open project in $BROWSER
	@make command-intro-msg msg="Opening project in your browser"
	@symfony open:local

server-start: ## Start server
	@make command-intro-msg msg="Starting server"
	@symfony server:start -d

server-stop: ## Stop server
	@make command-intro-msg msg="Stopping server"
	@symfony server:stop

create-local-env: ## Create .env.local file
	@make command-intro-msg msg="Creating env file"
	@if [ ! -f '.env.local' ]; then \
		touch .env.local && make fill-local-env; \
	fi


fill-local-env: ## Fill .env.local file with 'root/root'
	@make command-intro-msg msg="Filling env , using 'root:root'"
	echo "DATABASE_URL='mysql://$(MYSQL_USERNAME):$(MYSQL_PASSWORD)@$(MYSQL_HOST):$(MYSQL_PORT)/$(APP)?serverVersion=10.5.8-MariaDB'" | tee .env.local; \

cache-clear: ## Clear symfony cache
	@make command-intro-msg msg="Clearing cache"
	@$(SYMFONY) cache:clear \

db-drop: ## Drop database
	@make command-intro-msg msg="Dropping database"
	@$(SYMFONY) d:d:d -f --if-exists

db-create: ## Create database
	@make command-intro-msg msg="Creating database"
	@$(SYMFONY) d:d:c --if-not-exists

db-migrate: ## Migrating databse schema
	@make command-intro-msg msg="Migrating database"
	@$(SYMFONY) d:m:m --no-interaction --allow-no-migration

db-migration: ## Create database migration
	@make command-intro-msg msg="Creating database migration"
	@$(SYMFONY) make:migration

db-fixtures: ## Load fixtures
	@make command-intro-msg msg="Loading fixtures"
	@$(SYMFONY) d:f:l --no-interaction

composer-install: ## Install dependencies
	@make command-intro-msg msg="Installing composer dependencies"
	@composer install --no-interaction

test-db: ## Migrate test DB and run tests / testName=TESTNAME to only run TESTNAME
	@make command-intro-msg msg="Migrating database and Running tests"

	$(SYMFONY) d:m:m --env=test --no-interaction --allow-no-migration && \
	$(SYMFONY) doctrine:fixtures:load --env=test --no-interaction; \

	@if [ -z $(testName) ]; then \
		php bin/phpunit --colors=always; \
	else \
		php bin/phpunit --colors=always --filter=$(testName); \
	fi

test: ## Run Tests / testName=TESTNAME to only run TESTNAME
	@make command-intro-msg msg="Running tests"

	@if [ -z $(testName) ]; then \
		php bin/phpunit --colors=always; \
    else \
		php bin/phpunit --colors=always --filter=$(testName); \
	fi

start-working: ## Launch server and open website
	@make recipe-intro-msg msg="Starting work..."
	@make server-start && \
	gh browse && \
	make open-browser && \
	clear && \
	yarn watch


yarn-install: ## Install node packages
	@make command-intro-msg msg="Installing Yarn packages"
	@yarn install

help: ## Show this help menu
	@awk -F ':|##' '/^[^\t].+?:.*?##/ {printf "\033[36m%-30s\033[0m %s\n", $$1, $$NF}' $(MAKEFILE_LIST)
