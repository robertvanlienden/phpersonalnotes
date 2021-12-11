.PHONY: *
help : Makefile
	@sed -n 's/^##//p' $<

docker := $(shell if [ `pwd` != "/app" ]; then echo 'docker-compose exec php'; fi;)


## up						: Get docker containers up
## down						: Get docker containers down
## restart					: Restart docker containers
## ssh						: SSH into the PHP container
up:
	@docker-compose up -d
down:
	@docker-compose down
restart:
	@docker-compose restart
ssh:
	@docker-compose exec php sh

## clear-cache					: Clear cache
## clear-database					: Clear database, run migrations, load fixtures
clear-cache:
	${docker} bin/console cache:clear
clear-database:
	${docker} bin/console --env=dev doctrine:schema:drop --full-database --force
	${docker} bin/console doctrine:migrations:migrate -n
	${docker} bin/console doctrine:fixtures:load -n

## diff						: Generate migration
## migrate					: Run migrations
diff:
	${docker} bin/console doctrine:migrations:diff
migrate:
	${docker} bin/console doctrine:migrations:migrate -n

## entity						: Make entity
entity:
	${docker} bin/console make:entity

## watch-frontend					: Watch for front-end changes and compile front-end assets
## build-frontend					: Build production front-end
watch-frontend:
	${docker} yarn run watch
build-frontend:
	${docker} yarn run build

## check-cs					: Check for codestyle issues
## fix-cs						: Fix codestyle issues
check-cs:
	${docker} ./vendor/bin/php-cs-fixer fix --diff --dry-run
fix-cs:
	${docker} ./vendor/bin/php-cs-fixer fix
