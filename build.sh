# Compile
npm install
npm run compile

# Package
rm -rf builds && mkdir builds
cp -r dist/src builds
cp -r node_modules builds
cd builds && ls -al && zip -r -q spotify-api.zip ./* && cd ..

