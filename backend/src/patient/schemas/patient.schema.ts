import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';

export type PatientDocument = Patient & Document;

@Schema({
  collection: 'patient',
  toJSON: {
    virtuals: true,
    transform: (doc: any, ret: any) => {
      // delete obsolete data
      delete ret._id;
    },
  },
  versionKey: false,
})
export class Patient {
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
    trim: true,
  })
  bloodtype: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  })
  doctorId: mongoose.Schema.Types.ObjectId;
}

export const PatientSchema = SchemaFactory.createForClass(Patient);

PatientSchema.index({ firstname: 1, lastname: 1 }, { unique: true });
