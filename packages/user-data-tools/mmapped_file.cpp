#include "mmapped_file.hpp"

#include <errno.h>
#include <fcntl.h>
#include <sys/mman.h>
#include <sys/stat.h>
#include <unistd.h>

namespace util {

mmapped_file::mmapped_file(const std::string &filename, Hint hint)
    : _filename(filename), _hint(hint), _file(0), _file_size(0),
      _data(nullptr) {
  open();
}

mmapped_file::~mmapped_file() { close(); }

bool mmapped_file::is_opened() const { return _data != nullptr; }

bool mmapped_file::open() {
  if (is_opened()) {
    return false;
  }
  _file = ::open(_filename.c_str(), O_RDONLY | O_LARGEFILE);
  if (_file == -1) {
    goto clean;
  }
  struct stat64 file_stat;
  if (::fstat64(_file, &file_stat) < 0) {
    ::close(_file);
    goto clean;
  }
  _file_size = file_stat.st_size;
  _data = ::mmap64(nullptr, _file_size, PROT_READ, MAP_SHARED, _file, 0);
  if (_data == MAP_FAILED) {
    ::close(_file);
    goto clean;
  }
  switch (_hint) {
  case Normal:
    ::madvise(_data, _file_size, MADV_NORMAL);
    break;
  case SequentialScan:
    ::madvise(_data, _file_size, MADV_SEQUENTIAL);
    break;
  case RandomAccess:
    ::madvise(_data, _file_size, MADV_RANDOM);
    break;
  default:
    break;
  }
  return true;

clean:
  _file = 0;
  _file_size = 0;
  _data = nullptr;
  return false;
}

void mmapped_file::close() {
  if (_data) {
    ::munmap(_data, _file_size);
    _data = nullptr;
  }
  if (_file) {
    ::close(_file);
    _file = 0;
  }
  _file_size = 0;
}

std::uint64_t mmapped_file::file_size() const { return _file_size; }

const unsigned char *mmapped_file::data() const {
  return (const unsigned char *)_data;
}

unsigned char mmapped_file::operator[](std::size_t offset) const {
  return data()[offset];
}

} // namespace util
