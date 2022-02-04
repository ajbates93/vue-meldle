#!/usr/bin/env sh
# abort on errors
set -e
# build
npm run build
echo 'after build'
# navigate into the build output directory
cd dist
echo 'cd dist'
# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME
git init
git add -A
git commit -m 'deploy'
echo 'after commit'
git push -f git@github.com:ajbates93/vue-meldle.git master:gh-pages
echo 'after push'
cd -
echo 'after change directory'

chmod +x deploy.sh