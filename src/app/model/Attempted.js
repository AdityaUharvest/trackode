import mongoose, { Schema } from 'mongoose';
import Question from './Question';
import Quiz from './Quiz';
import User from './User';
const resultSchema = new Schema({
  student: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  quiz: { 
    type: Schema.Types.ObjectId, 
    ref: 'Quiz', 
    required: true 
  },
  title:{
    type:String,
    
  },

  score: { 
    type: Number, 
    required: true 
  },
  totalQuestions: { 
    type: Number, 
    required: true 
  },
  correctAnswers: { 
    type: Number, 
     
  },
  incorrectAnswers: { 
    type: Number, 
     
  }, 
  startTime:{
    type:String
  },
  answers: [{
    question: { 
      type: String, 
      required: true 
    },
    userAnswer: { 
      type: String, 
      required: true 
    },
    correctAnswer: { 
      type: String, 
      required: true 
    },
    isCorrect: { 
      type: Boolean, 
      required: true 
    }
  }],
  attemptedAt: { 
    type: Date, 
    default: Date.now 
  },
  attempted:{
    type:Boolean,
    default:false
  },
  fullScreenViolations: {
    type: Number,
    default: 0
  },
        visibilityChanged: {
          type: Number,
          default: 0
        },

        submittedAutomatically: {
          type: Boolean,
          default: false
        },
        timeLeft: {
          type: Number,
          default: 0
        },

});

export default mongoose.models.Result || mongoose.model('Result', resultSchema);