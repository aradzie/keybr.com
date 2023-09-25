#pragma once

#include <cinttypes>

namespace keybr {

enum text_type_id { generated_text_id = 1, normal_text_id = 2, numbers_id = 3 };

const int SAMPLE_COUNT = 128;

class stats_sample {
public:
  std::uint32_t code_point;
  std::uint32_t hit_count;
  std::uint32_t miss_count;
  std::uint32_t time_to_type;

  bool validate() const;
};

class stats_histogram {
public:
  std::uint32_t sample_count;
  stats_sample sample_list[SAMPLE_COUNT];

  bool validate() const;
};

class stats_result {
public:
  std::uint8_t layout_id;
  std::uint8_t text_type_id;
  std::uint32_t timestamp;
  std::uint32_t length;
  std::uint32_t time;
  std::uint32_t errors;
  stats_histogram histogram;

  bool validate() const;
};

} // namespace keybr
