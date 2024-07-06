DELETE FROM `user`;
ALTER TABLE User MODIFY COLUMN id BIGINT AUTO_INCREMENT;
INSERT INTO `user` (id, name, password) VALUES
                                              (1, 'Jone', '123'),
                                              (2, 'Jack', '123'),
                                              (3, 'Tom', '123');