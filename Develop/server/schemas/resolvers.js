const { AuthenticationError } = require('apollo-server-express')
const { User } = require('../models')
const { signToken } = require('../utils/auth')

const resolvers = {
  Query: {
    me: async (parent, args, { user }) => {
      if(user) {
        return await User.findOne({ _id: user._id }).select('-__v -password')
      } else {
        throw new AuthenticationError('Not logged in')
      }
    }
  },

  Mutation: {
    login: async (parent, { email, password }) => {
      const currentUser = await User.findOne({ email })

      if (!currentUser) throw new AuthenticationError('Invalid email address!')
      
      const correctPasswordBoolean = await currentUser.isCorrectPassword(password)

      if (!correctPasswordBoolean) throw new AuthenticationError('Correct email but invalid password!')

      const token = signToken(currentUser)
      return { token, currentUser }
    },

    addUser: async (parent, { username, email, password }) => {
      const newUser = await User.create({ username, email, password })
      const token = signToken(newUser)

      return { token, newUser }
    },

    saveBook: async (parent, { input }, { user }) => {
      if (user) return await User.findOneAndUpdate({ _id: user._id }, { $addToSet: { savedBooks: input } }, { new: true })
      
      throw new AuthenticationError('You must be logged in to save a book!')
    },

    removeBook: async (parent, { bookId }, { user }) => {
      if (user) return await User.findOneAndUpdate({ _id: user._id }, { $pull: { savedBooks: { bookId: bookId } } }, { new: true })
      
      throw new AuthenticationError('You must be logged in to remove a book!')
    }
  }
}

// export resolvers
module.exports = resolvers