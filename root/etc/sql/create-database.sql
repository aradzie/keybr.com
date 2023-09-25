create database if not exists `keybr`
  default charset `utf8`
  default collate `utf8_general_ci`;

create user if not exists 'keybr'@'localhost';

alter user 'keybr'@'localhost' identified with mysql_native_password by '';

grant all privileges on `keybr`.* to 'keybr'@'localhost';

flush privileges;
