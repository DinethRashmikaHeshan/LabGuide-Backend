const examModel = require('../models/exam');
const QuestionController = require('./QuestionController');
const { singleChoiceModel, multiChoiceModel, essayModel } = require('../models/Question'); // Ensure models are imported

class ExamController {
    static async createExam(req, res) {
        try {
            const { examDetail, date, time, duration } = req.body;
            const exam = new examModel({
                examDetails: examDetail,
                eDate: date,
                eTime: time,
                duration: duration
            });

            await exam.save();
            res.status(201).json(exam);
        } catch (error) {
            console.error("Error creating exam:", error);
            res.status(500).json({ message: error.message });
        }
    }

    static async viewAllExams(req, res) {
        try {
            const exams = await examModel.find();
            res.status(200).json(exams);
        } catch (error) {
            console.error("Error retrieving exams:", error);
            res.status(500).json({ message: error.message });
        }
    }

    static async deleteExam(req, res) {
        try {
            const delExam = await examModel.findByIdAndDelete(req.params.id);
            if (!delExam) {
                return res.status(404).json({ message: "Exam not found" });
            }
            res.status(200).json(delExam);
        } catch (error) {
            console.error("Error deleting exam:", error);
            res.status(500).json({ message: error.message });
        }
    }

    static async updateExam(req, res) {
        try {
            const { examId } = req.params; // Exam ID from the request parameters
            console.log(examId)
            const updates = req.body; // Dynamically capture any provided fields from the request body
    
            // Find the exam by ID and update only the provided fields
            const updatedExam = await examModel.findByIdAndUpdate(
                examId, 
                { $set: updates }, // Only update the fields passed in req.body
                { new: true } // Return the updated document
            );
    
            if (!updatedExam) {
                return res.status(404).json({ message: "Exam not found" });
            }
    
            res.status(200).json(updatedExam); // Return the updated exam
        } catch (error) {
            console.error("Error updating exam:", error);
            res.status(500).json({ message: error.message });
        }
    }

    static async getEachExam(req, res) {
        try {
            const { examID } = req.params; // Extract examID from request parameters
    
            // Find the exam by its ID
            const exam = await examModel.findById(examID);
    
            // If the exam is not found, return a 404 error
            if (!exam) {
                return res.status(404).json({ message: "Exam not found" });
            }
    
            // Return the exam details in the response
            res.status(200).json({ exam });
        } catch (error) {
            console.error("Error retrieving exam:", error);
            res.status(500).json({ message: error.message });
        }
    }
    
    
    

    static async createQuestionForExam(req, res) {
        try {
            const data = await QuestionController.createQuestion(req);
            const quesDetails = await examModel.findByIdAndUpdate(req.params.id, { $push: { question: data } }, { new: true });
            res.status(200).json(quesDetails);
        } catch (error) {
            console.error("Error creating question for exam:", error);
            res.status(500).json({ message: error.message });
        }
    }

    static async viewAllExamQuestion(req, res) {
        try {
            const all = await examModel.findById(req.params.id);
            if (!all) {
                return res.status(404).json({ message: "Exam not found" });
            }
            const ques = all.question;
            res.status(200).json(ques);
        } catch (error) {
            console.error("Error retrieving exam questions:", error);
            res.status(500).json({ message: error.message });
        }
    }

    static async deleteQuestion(req, res) {
        try {
            const { examID, quesID } = req.params;
            const delQuestion = await examModel.findByIdAndUpdate(
                examID,
                { $pull: { question: { _id: quesID } } },
                { new: true }  // Return the updated document
            );
            if (!delQuestion) {
                return res.status(404).json({ message: "Question not found" });
            }
            res.status(200).json(delQuestion);
        } catch (error) {
            console.error("Error deleting question:", error);
            res.status(500).json({ message: error.message });
        }
    }

    static async getEachQuestion(req, res) {
        try {
            const { examID, quesID } = req.params;
            const exam = await examModel.findOne(
                { _id: examID, "question._id": quesID },
                { "question.$": 1 }
            );

            if (!exam || exam.question.length === 0) {
                return res.status(404).json({ message: "Question not found" });
            }

            res.status(200).json({ question: exam.question[0] });
        } catch (error) {
            console.error("Error retrieving each question:", error);
            res.status(500).json({ message: error.message });
        }
    }

    static async updateQuestion(req, res) {
        try {
            const { examID, quesID } = req.params;
            const data = req.body;
    
            const exam = await examModel.findOne({ _id: examID, "question._id": quesID });
            if (!exam) {
                return res.status(404).json({ message: "Exam or question not found." });
            }
    
            const question = exam.question.id(quesID);
            const questionType = question.questionType;
    
            let updatedQuestion;
            switch (questionType) {
                case 'SingleChoiceQuestion':
                    updatedQuestion = await singleChoiceModel.findOneAndUpdate(
                        { _id: quesID },
                        { $set: { options: data.options, correctAnswer: data.correctAnswer } },
                        { new: true, runValidators: true } // Ensure validation is checked
                    );
                    break;
                case 'MultiChoiceQuestion':
                    updatedQuestion = await multiChoiceModel.findOneAndUpdate(
                        { _id: quesID },
                        { $set: { options: data.options, correctAnswers: data.correctAnswers } },
                        { new: true, runValidators: true }
                    );
                    break;
                case 'EssayQuestion':
                    const updateFields = { wordLimit: data.wordLimit };
                    if (data.answer !== undefined) {
                        updateFields.answer = data.answer;
                    }
    
                    updatedQuestion = await essayModel.findOneAndUpdate(
                        { _id: quesID },
                        { $set: updateFields },
                        { new: true, runValidators: true }
                    );
                    break;
                default:
                    return res.status(400).json({ message: "Invalid question type." });
            }
    
            if (!updatedQuestion) {
                return res.status(404).json({ message: "Question not found or update failed." });
            }
    
            res.status(200).json(updatedQuestion);
        } catch (error) {
            console.error("Error updating question:", error);
            res.status(500).json({ message: error.message });
        }
    }
    
}

module.exports = ExamController;
