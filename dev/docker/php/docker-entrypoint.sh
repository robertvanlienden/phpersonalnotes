#!/bin/sh
set -e

# first arg is `-f` or `--some-option`
if [ "${1#-}" != "$1" ]; then
    set -- php-fpm "$@"
fi

if [ "$1" = 'php-fpm' ] || [ "$1" = 'php' ] || [ "$1" = 'bin/console' ]; then
    mkdir -p var/cache var/log
    setfacl -R -m u:www-data:rwX -m u:"$(whoami)":rwX var || true
    setfacl -dR -m u:www-data:rwX -m u:"$(whoami)":rwX var || true

    until nc -z -v -w30 "db" 3306
    do
      echo "Waiting for database connection..."
      sleep 10
    done

    if [ "$APP_ENV" != 'prod' ]; then
        composer install --prefer-dist --no-progress --no-suggest --no-interaction
        yarn install
        yarn encore dev
    fi

    composer run-script --no-dev post-install-cmd
#
    bin/console doctrine:migrations:migrate --no-interaction --allow-no-migration
fi

exec docker-php-entrypoint "$@"
