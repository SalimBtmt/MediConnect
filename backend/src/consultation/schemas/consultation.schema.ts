import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ConsultationDocument = Consultation & Document;

@Schema({
  collection: 'consultation',
  toJSON: {
    virtuals: true,
    transform: (doc: any, ret: any) => {
      // delete obsolete data
      delete ret._id;
    },
  },
  versionKey: false,
})
export class Consultation {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  })
  _id: any;

  @Prop({
    type: Date,
    required: true,
  })
  dateStart: string;

  @Prop({
    type: Date,
    required: true,
  })
  dateEnd: string;

  @Prop({
    type: String,
    required: true,
    minlength: 2,
    trim: true,
  })
  motive: string;

  @Prop({
    type: String,
    required: false,
    minlength: 2,
    trim: true,
  })
  comment: string;

  @Prop({
    type: String,
    required: false,
    minlength: 2,
    trim: true,
  })
  prescription: string;

  // TODO
  // doctor: {
  //   type : mongoose.Schema.Types.ObjectId,
  //     ref: 'doctor'
  // }
  // patient: {
  //   type : mongoose.Schema.Types.ObjectId,
  //     ref: 'patient'
  // }
}

export const ConsultationSchema = SchemaFactory.createForClass(Consultation);