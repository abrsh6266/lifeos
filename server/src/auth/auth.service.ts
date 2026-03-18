import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "./dto/register.dto";
import * as bcript from "bcrypt";
import { LoginDto } from "./dto/login.dto";
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.userService.finByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException("Email already Registered");
    }

    const hashedPassword = await bcript.hash(dto.password, 12);

    const user = await this.userService.create({
      email: dto.email,
      password: hashedPassword,
    });

    const token = this.generateToken(user.id, user.email);

    return { access_token: token, user: { id: user.id, email: user.email } };
  }

  async login(dto: LoginDto) {
    const user = await this.userService.finByEmail(dto.email);
    if (!user) {
      throw new ConflictException("Invalid Credentials");
    }

    const passwordValid = await bcript.compare(dto.password, user.password);

    if (!passwordValid) {
      throw new UnauthorizedException("Invalid Credentials");
    }

    const token = this.generateToken(user.id, user.email);

    return { access_token: token, user: { id: user.id, email: user.email } };
  }

  private generateToken(userId: string, email: string) {
    return this.jwtService.sign({ sub: userId, email });
  }
}
