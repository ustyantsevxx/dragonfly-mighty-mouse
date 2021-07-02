const { Schema, model } = require('mongoose')

const subjectSchema = new Schema(
  {
    course: {
      type: Number,
      unique: true,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    teacherId: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
)

subjectSchema.methods.add = async function (data) {
  this.name = data.name
  this.course = data.course
  this.teacherId = data.teacherId
  await this.save()
}

subjectSchema.methods.update = async function (data) {
  this.name = data.name
  this.course = data.course
  this.teacherId = data.teacherId
  await this.save()
}

subjectSchema.methods.delete = async function () {
  await this.delete()
}

module.exports = model('Subject', subjectSchema)
