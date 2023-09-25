#include "buffer.hpp"
#include "mmapped_file.hpp"
#include "stats_data.hpp"
#include "stats_file_name.hpp"
#include "stats_result.hpp"

#include <filesystem>
#include <iostream>

namespace fs = std::filesystem;

namespace keybr {

void check_stats_file(const fs::path &path, check_status &status) {
  status.status = Status::good;
  status.good_count = 0;

  util::mmapped_file file(path, util::mmapped_file::SequentialScan);
  util::buffer buffer{file.data(), file.file_size()};
  keybr::stats_data stats_data{buffer};

  if (!stats_data.check_signature()) {
    status.status = Status::corrupted;
    return;
  }

  keybr::stats_result result;
  while (!stats_data.eof()) {
    if (!stats_data.read_result(result)) {
      status.status = Status::corrupted;
      return;
    }
    if (!result.validate()) {
      status.status = Status::invalid;
      continue;
    }
    status.good_count += 1;
  }
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

  for (fs::directory_entry const &entry :
       fs::recursive_directory_iterator(root)) {
    if (entry.is_regular_file()) {
      const fs::path &path = entry.path();
      keybr::stats_file_id file_id;
      if (keybr::parse_stats_file_name(path, file_id)) {
        if (file_id.user_id != 0 && file_id.backup_num == 0) {
          keybr::check_status status;
          keybr::check_stats_file(path, status);
          switch (status.status) {
          case keybr::Status::good:
            break;
          case keybr::Status::corrupted:
            std::cout << path << " corrupted data" << std::endl;
            break;
          case keybr::Status::invalid:
            std::cout << path << " invalid data" << std::endl;
            break;
          }
        }
      }
    }
  }

  return EXIT_SUCCESS;
}
