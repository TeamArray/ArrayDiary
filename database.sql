create user arraydiary@localhost;
create schema arraydiary;
grant all privileges on arraydiary.* to arraydiary@localhost;

use arraydiary;

create table diaries (
  id varchar(20) not null,
  author varchar(20) not null,
  length int not null,
  createdAt timestamp default CURRENT_TIMESTAMP not null,
  stars int default 0 not null
);
