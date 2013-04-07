all:
	browserify main.js > tmp.js
	cat socket.io.js filer.min.js tmp.js > prefetch.js
	rm tmp.js
	nodefront minify -p prefetch.js -o prefetch.js
