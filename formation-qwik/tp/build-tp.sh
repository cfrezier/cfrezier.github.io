#!/bin/bash

STOP_DIR=$1

echo "Remove power-ranger-app"
rm -rf power-ranger-app

npm create qwik@latest empty power-ranger-app  -i

for i in $(find . -name "solution" -type d | sort --numeric-sort); do
  cp -r $i/* ./power-ranger-app

  CURRENT_PATH="$(dirname "${i}")"
  BUILD_SCRIPT="${CURRENT_PATH}/build.sh"

  if [ -f "$BUILD_SCRIPT" ]; then
    echo "running $BUILD_SCRIPT"
    pushd ./power-ranger-app
    ../$BUILD_SCRIPT
    popd
  fi

  if [[ "$i" == *"$STOP_DIR"* ]];
  then
      echo "stopping at $i"
      break
  else
      echo "...adding $i"
  fi
done

pushd power-ranger-app || echo "power-ranger-app doesn't exist"

npm run start