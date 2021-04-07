@echo off

for /d %%a in (build\*) do (rmdir /q /s %%a)
del /q .\build\*.*
