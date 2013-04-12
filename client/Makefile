dev:
	browserify main.js > tmp.js
	cat libraries/sockjs.min.js libraries/filer.js tmp.js > prefetch.js
	rm tmp.js

prod:
	make dev
	nodefront minify -p prefetch.js -o prefetch.js
