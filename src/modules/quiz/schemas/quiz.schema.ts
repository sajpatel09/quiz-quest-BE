import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, Types} from 'mongoose';

export type QuizDocument = HydratedDocument<Quiz>

@Schema()
export class Quiz {
    @Prop({required: true})
    title: string;

    @Prop({type: Types.ObjectId, ref: 'Category', required: true})
    category: Types.ObjectId;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
