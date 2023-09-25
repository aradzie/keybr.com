#include "stats_file_name.hpp"

#include <cctype>
#include <filesystem>

namespace fs = std::filesystem;

namespace keybr {

const char *DEFAULT_ROOT = "/var/lib/keybr/user_stats/";

bool parse_stats_file_name(const fs::path &path, stats_file_id &id) {
  const char *filename = path.filename().c_str();
  id.user_id = 0;
  id.backup_num = 0;
  for (int i = 0; i < 100; i++) {
    const char ch = filename[i];
    if (i < 9) {
      if (ch == 0) {
        return false;
      }
      if (ch < '0' || ch > '9') {
        return false;
      }
      id.user_id = id.user_id * 10 + (ch - '0');
      continue;
    }
    if (i == 9) {
      if (ch == 0) {
        return true;
      }
      if (ch != '~') {
        return false;
      }
      continue;
    }
    if (i > 9) {
      if (ch == 0) {
        return true;
      }
      if (ch < '0' || ch > '9') {
        return false;
      }
      id.backup_num = id.backup_num * 10 + (ch - '0');
      continue;
    }
  }
  return false;
}

} // namespace keybr
