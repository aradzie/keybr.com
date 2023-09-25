COMPILER=g++
CFLAGS=-std=c++20 -Wall -Wextra -fwrapv -O2

all:
	$(COMPILER) $(CFLAGS) -o keybr-check-stats \
		buffer.cpp \
		mmapped_file.cpp \
		stats_data.cpp \
		stats_file_name.cpp \
		stats_result.cpp \
		keybr-check-stats.cpp
	$(COMPILER) $(CFLAGS) -o keybr-build-histogram \
		buffer.cpp \
		mmapped_file.cpp \
		stats_data.cpp \
		stats_file_name.cpp \
		stats_result.cpp \
		keybr-build-histogram.cpp

clean:
	rm keybr-check-stats keybr-build-histogram

format:
	find . -iname '*.hpp' -o -iname '*.cpp' | xargs clang-format -i
