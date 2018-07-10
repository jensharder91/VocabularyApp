#!/bin/bash

PWWD=$(pwd)
mvn clean generate-sources
echo "Cleaning old generated sources"
rm -f ../client/swagger/api/*.ts
rm -f ../client/swagger/model/*.ts
echo "Copy generated sources into project"
cp -r generated/vocapp-ts/api/* ../client/swagger/api/
cp -r generated/vocapp-ts/model/* ../client/swagger/model/

# echo "Cleaning old generated sources"
# rm -f ../server/frischesWissen-api/src/main/java/de/rewe/frisches/wissen/api/model/swagger/v1/*
# echo "Copy generated sources into project"
# cp -r generated/frischeswissen-java/src/main/java/io/swagger/client/model/* ../server/frischesWissen-api/src/main/java/de/rewe/frisches/wissen/api/model/swagger/v1/
# echo "Fix package name of models"
# cd ../server/frischesWissen-api/src/main/java/de/rewe/frisches/wissen/api/model/swagger/v1
# sed -i '.deleteme' 's/io.swagger.client.model/de.rewe.frisches.wissen.api.model.swagger.v1/g' *
# find . -name "*.deleteme" | xargs rm
