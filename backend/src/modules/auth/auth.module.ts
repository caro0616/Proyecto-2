import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './application/auth.service';
import { AuthController } from './presentation/auth.controller';
import { UserDoc, UserSchema } from './infrastructure/persistence/schemas/user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: UserDoc.name, schema: UserSchema }])],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
