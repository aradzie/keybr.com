#include "buffer.hpp"
#include "mmapped_file.hpp"
#include "stats_data.hpp"
#include "stats_file_name.hpp"
#include "stats_result.hpp"

#include <array>
#include <filesystem>
#include <iostream>

namespace fs = std::filesystem;

namespace keybr {

const u_int32_t hist_size = 751;

void build_histogram(const fs::path &path, u_int32_t hist[]) {
  util::mmapped_file file(path, util::mmapped_file::SequentialScan);
  util::buffer buffer{file.data(), file.file_size()};
  keybr::stats_data stats_data{buffer};

  if (!stats_data.check_signature()) {
    return;
  }

  keybr::stats_result result;
  while (!stats_data.eof()) {
    if (!stats_data.read_result(result)) {
      return;
    }
    if (!result.validate()) {
      continue;
    }
    auto time = result.time;
    auto length = result.length;
    auto complexity = result.histogram.sample_count;
    if (result.text_type_id == normal_text_id && time > 0 && length > 0 &&
        complexity >= 20) {
      uint32_t speed = (length / (time / 1000.0)) * 60.0;
      if (speed > 0 && speed < hist_size) {
        hist[speed] += 1;
      }
    }
  }
}

void normalize_histogram(u_int32_t hist[]) {
  u_int32_t max = 0;
  for (uint32_t i = 0; i < hist_size; i++) {
    max = std::max(max, hist[i]);
  }
  if (max > 0) {
    for (uint32_t i = 0; i < hist_size; i++) {
      hist[i] = ((double)hist[i] / (double)max) * 1000.0;
    }
  }
}

void print_histogram(u_int32_t hist[]) {
  std::cout << "[";
  for (uint32_t i = 0; i < hist_size; i++) {
    if (i > 0) {
      std::cout << ",";
    }
    std::cout << hist[i];
  }
  std::cout << "]";
  std::cout << std::endl;
}

} // namespace keybr

int main(int argc, char *argv[]) {
  fs::path root{keybr::DEFAULT_ROOT};

  if (argc == 2) {
    root = fs::path{argv[1]};
  }

  if (!root.is_absolute()) {
    std::cout << "path " << root << " is not absolute" << std::endl;
    return EXIT_FAILURE;
  }

  if (!fs::is_directory(fs::status(root))) {
    std::cout << "path " << root << " is not a directory" << std::endl;
    return EXIT_FAILURE;
  }

  root = fs::canonical(root);

  u_int32_t hist[keybr::hist_size];
  std::fill_n(hist, keybr::hist_size, 0);

  for (fs::directory_entry const &entry :
       fs::recursive_directory_iterator(root)) {
    if (entry.is_regular_file()) {
      const fs::path &path = entry.path();
      keybr::stats_file_id file_id;
      if (keybr::parse_stats_file_name(path, file_id)) {
        if (file_id.user_id != 0 && file_id.backup_num == 0) {
          keybr::build_histogram(path, hist);
        }
      }
    }
  }

  keybr::normalize_histogram(hist);
  keybr::print_histogram(hist);

  return EXIT_SUCCESS;
}
