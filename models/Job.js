import mongoose from 'mongoose';
import * as Yup from 'yup';

export const jobValidationSchema = Yup.object({
  status: Yup.string().oneOf(['Approved', 'Cancelled', 'Implemented']).default('Approved'),
  jobType: Yup.string().oneOf(['NSA', 'LSA', 'HSA']).default('NSA'),
  jobTechnology: Yup.string().oneOf(['2G', '3G', '4G']).default('4G').required('Please provide jobTechnology'),
  team: Yup.string().oneOf(['Ericsson', 'Nokia', 'Huawei']).default('Ericsson').required('Please provide team'),
  crNumber: Yup.string().matches(/MTN-CR-(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])-\d{5}/, 'Invalid CR format'),
});

const JobSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['Approved', 'Implemented', 'Cancelled'],
      default: 'Approved',
      required: true,
    },
    jobType: {
      type: String,
      enum: ['NSA', 'LSA', 'HSA'],
      default: 'NSA',
      required: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
    crNumber: {
      type: String,
      required: [true, 'Please provide CRNumber'],
    },
    team: {
      type: String,
      enum: ['Ericsson', 'Nokia', 'Huawei'],
      default: 'Ericsson',
      required: true,
    },
    jobTechnology: {
      type: String,
      enum: ['2G', '3G', '4G'],
      default: '4G',
      required: true,
    },
    startTime: {
      type: Date,
      required: [true, 'Please provide startTime'],
    },
    endTime: {
      type: Date,
      required: [true, 'Please provide endTime'],
    },
    group: {
      type: String,
      trim: true,
      maxlength: 20,
      required: true ,
    },
  },
  { timestamps: true }
);

// Validate the document against the validation schema before saving
JobSchema.pre('save', async function (next) {
  try {
    await jobValidationSchema.validate(this.toObject());
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model('Job', JobSchema);
