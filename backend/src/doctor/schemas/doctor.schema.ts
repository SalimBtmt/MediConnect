import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';

export type DoctorDocument = Doctor & Document;

@Schema({
  toJSON: {
    virtuals: true,
    transform: (doc: any, ret: any) => {
      // delete obsolete data
      delete ret._id;
    },
  },
  versionKey: false,
})
export class Doctor {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  })
  _id: any;

  @Prop({
    type: String,
    required: true,
    minlength: 2,
    trim: true,
  })
  firstname: string;

  @Prop({
    type: String,
    required: true,
    minlength: 2,
    trim: true,
  })
  lastname: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  specialty: string;

  @Prop({
    type: Date,
    required: true,
  })
  birthDate: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
    match: /^(\+\d{11})$/,
  })
  phone: string;

  @Prop(
    raw({
      street: {
        type: String,
        required: true,
        trim: true,
      },
      postalCode: {
        type: Number,
        required: true,
      },
      city: {
        type: String,
        required: true,
        trim: true,
      },
    }),
  )
  address: any;

  @Prop({
    type: String,
    required: true,
    minlength: 2,
    trim: true,
  })
  username: string;

  @Prop({
    type: String,
    required: true,
    minlength: 2,
    trim: true,
  })
  password: string;
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);