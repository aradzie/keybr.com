#include <cinttypes>
#include <filesystem>

namespace keybr {

extern const char *DEFAULT_ROOT;

struct stats_file_id {
public:
  stats_file_id() : user_id{}, backup_num{} {}
  std::uint64_t user_id;
  std::uint64_t backup_num;
};

bool parse_stats_file_name(const std::filesystem::path &path,
                           stats_file_id &id);

enum Status { good, corrupted, invalid };

struct check_status {
public:
  Status status;
  int good_count;
};

void check_stats_file(const std::filesystem::path &path, check_status &status);

} // namespace keybr
