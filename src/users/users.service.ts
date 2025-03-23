import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // Lấy danh sách users
  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  // Tìm user theo ID
  findOne(id: string): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  // Thêm user mới
  create(userData: Partial<User>): Promise<User> {
    const newUser = this.usersRepository.create(userData);
    return this.usersRepository.save(newUser);
  }

  // Cập nhật user
  async update(id: string, userData: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, userData);
    return this.findOne(id);
  }

  // Xóa user
  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  // Find by email
  findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOneBy({ email });
  }
}
