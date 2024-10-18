import { User } from 'src/core/domain/user.entity';

export class SendData {
  data: User[];
  limit?: string;
  page?: string;
  totalPages?: string;
}
