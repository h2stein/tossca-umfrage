#!/bin/bash

export port=8002
echo "Open link in a modern web browser: http://localhost:${port}/index.html"
python -m SimpleHTTPServer "${port}"
 