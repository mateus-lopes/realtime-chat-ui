#!/bin/sh
find /usr/share/nginx/html/assets/ -type f -name "*.js" -exec sed -i \
    -e "s|__VITE_API_URL__|${VITE_API_URL}|g" {} \;

exec nginx -g "daemon off;"