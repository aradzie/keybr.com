#pragma once

#include "buffer.hpp"
#include "stats_result.hpp"

namespace keybr {

class stats_data {
public:
  stats_data(util::buffer &buf);

  bool eof() const;

  bool check_signature();

  bool read_result(stats_result &result);

private:
  stats_data(const stats_data &);
  stats_data &operator=(const stats_data &);

  util::buffer &_buf;
};

} // namespace keybr
