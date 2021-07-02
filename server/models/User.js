const { Schema, model } = require('mongoose')

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    surname: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    isTeacher: { type: Boolean, required: true }
  },
  { timestamps: true }
)

userSchema.methods.updateToken = async function () {
  this.token =
    this.email +
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  await this.save()
}

userSchema.methods.updateTask = async function (data) {
  await this._setData(data)
  await this.save()
}

module.exports = model('User', userSchema)
