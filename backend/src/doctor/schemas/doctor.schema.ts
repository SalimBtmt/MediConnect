import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';

export type DoctorDocument = Doctor & Document;

@Schema({
  timestamps: true,
  collection: 'doctor',
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
    required: false,
    trim: true,
  })
  specialty: string;

  @Prop({
    type: Date,
    required: false,
  })
  birthDate: string;

  @Prop({
    type: String,
    required: false,
    trim: true,
  })
  email: string;

  @Prop({
    type: String,
    required: false,
    match: /^(\+\d{11})$/,
  })
  phone: string;

  @Prop(
    raw({
      street: {
        type: String,
        required: false,
        trim: true,
      },
      postalCode: {
        type: Number,
        required: false,
      },
      city: {
        type: String,
        required: false,
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
    unique: true, // Set to true to indicate a unique constraint
    message: 'Duplicate username entered', // Define a custom error message
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

// Define a unique index on the 'username' field
// DoctorSchema.index({ username: 1 }, { unique: true });
