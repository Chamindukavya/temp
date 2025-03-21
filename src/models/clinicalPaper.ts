import mongoose, { Schema, models } from 'mongoose';
const clinicalQuestionSchema = new Schema({
  questionType: {
    type: String,
    required: true,
    enum: ['EMQ', 'SBA'],
  },
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [{
      label: {
        type: String,
        required: true,
        enum: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
      },
      text: {
        type: String,
        required: true,
      }
    }],
    required: true,
    validate: {
      validator: function(options: any[]): boolean {
        return options.length === 5 || options.length === 8;
      },
      message: 'Options array must have exactly 5 or 8 items'
    }
  },
  correctOption: {
    type: String,
    required: true,
    enum: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
    validate: {
      validator: function(correctOpt: string): boolean {
        // @ts-ignore - 'this' context in Mongoose validator
        const labels = this.options.map((opt: any) => opt.label);
        return labels.includes(correctOpt);
      },
      message: 'Correct option must be one of the provided option labels (A-E or A-H)'
    }
  },
  explanation: {
    type: String,
    required: true,
  },
  
  
}, { timestamps: true });



const clinicalPaper=new Schema({


    title:{
        type:String,
        required:true,
    },
    paperDescription:{
        type:String,
        required:true,
    },

    questions:[clinicalQuestionSchema],
    timeLimit:{
        type:Number,
        required:true,

    },
    createdAt:{
        type:Date,
        default:Date.now,
    },


})

const ClinicalPaper=models.ClinicalPaper||mongoose.model('ClinicalPaper',clinicalPaper)

export default ClinicalPaper;

