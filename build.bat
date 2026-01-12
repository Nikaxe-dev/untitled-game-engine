@echo off

set BUILD_DOCS=1

:parseArgs
if "%~1"=="" goto doneArgs

if /I "%~1"=="--noDocs" (
    set BUILD_DOCS=0
)

shift
goto parseArgs

:doneArgs

echo BUILDING PROJECT

if %BUILD_DOCS%==1 (
    echo BUILDING DOCUMENTATION
    call typedoc --out docs --options typedoc.json --name "untitled game engine"
)


echo RUNNING NODE BUILD SCRIPT
node ./build.js
echo RUNNING tsc --build
call tsc --build