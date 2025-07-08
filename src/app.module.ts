import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ConfigModule} from "@nestjs/config";
import {DatabaseModule} from "./modules/database/database.module";
import {AuthModule} from "./modules/auth/auth.module";
import {CategoryModule} from "./modules/category/category.module";
import {QuizModule} from "./modules/quiz/quiz.module";

@Module({
    imports: [
        ConfigModule.forRoot({isGlobal: true, envFilePath: '.env'}),
        DatabaseModule,
        AuthModule,
        CategoryModule,
        QuizModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
