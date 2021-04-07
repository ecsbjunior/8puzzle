cmake_minimum_required(VERSION 3.19)

project(8puzzle VERSION 1.0.0)

set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED True)

set(CMAKE_ARCHIVE_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/8puzzleSDK/lib CACHE PATH "Output directory for static libraries.")
set(CMAKE_LIBRARY_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/8puzzleSDK/lib CACHE PATH "Output directory for shared libraries.")
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/8puzzleSDK/bin CACHE PATH "Output directory for executables and DLL's.")

add_library(puzzlelib SHARED "./src/include/8puzzle.cpp" "./src/include/8puzzle.h")
target_include_directories(puzzlelib PUBLIC "./src/include")
target_compile_options(puzzlelib PRIVATE -DPUZZLE_IMPLEMENTATION)

add_executable(8puzzle "./src/main.cpp")
target_include_directories(8puzzle PUBLIC "./src/include")
target_link_libraries(8puzzle PRIVATE puzzlelib)
