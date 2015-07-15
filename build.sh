
# build test utils
./node_modules/.bin/browserify node_modules/code/lib/index.js -o test/code-1.4.1.js -s code --igv global,Buffer

# build browser versions
./node_modules/.bin/browserify zeno.js -o zeno-web.js -s zeno --dg false
