const { gql } = require('apollo-server')

const typeDefs = gql`

scalar DateTime
scalar Bytes
scalar Upload

type User {
  id: Int!
  username: String!
  email: String!
  password: String!
  mailboxes: [Mailbox!]!
  messages: [Message!]!
  messageSender: [Message!]!
  messageTo: [Message!]!
  messageCc: Message
  messageId: Int
  draft: [Draft!]!
  attachments: [Attachment!]!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Mailbox {
  id: Int!
  userId: Int!
  mailboxName: String!
  user: User!
  messages: [Message!]!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Message {
  id: Int!
  userId: Int!
  mailboxId: Int!
  subject: String
  body: String!
  readAt: DateTime!
  user: User!
  mailbox: Mailbox!
  sender: User
  senderId: Int
  to: User
  toId: Int!
  cc: [User!]
  parent: Message
  parentId: Int
  replies: [Message!]!
  createdAt: DateTime!
  updatedAt: DateTime!
  message: [Message!]!
  messages: Message
  messageId: Int
  draft: [Draft!]!
  attachments: [Attachment!]!
}

type Draft {
  id: Int!
  subject: String!
  createdAt: DateTime!
  deletedAt: DateTime
  userId: Int!
  user: User!
  message: Message
  messageId: Int!
}

type Attachment {
  id: Int!
  fileName: String!
  mimeType: String!
  data: Bytes!
  userId: Int
  user: User
  messageId: Int!
  message: Message!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Query {
  users: [User!]!
  user(id: Int!): User
  mailboxes: [Mailbox!]!
  mailbox(id: Int!): Mailbox
  messages: [Message!]!
  message(id: Int!): Message
  drafts: [Draft!]!
  draft(id: Int!): Draft
  attachments: [Attachment!]!
  attachment(id: Int!): Attachment
}

type Mutation {
  createUser(username: String!, email: String!, password: String!,messageId:ID!): User!
  updateUser(id: ID!, username: String!, email: String!, password: String!): User!
  deleteUser(id: ID!): User!

  createMailbox(userId: ID!, mailboxName: String!): Mailbox!
  updateMailbox(id: ID!, mailboxName: String!): Mailbox!
  deleteMailbox(id: ID!): Mailbox!

  createMessage(userId: ID!, mailboxId: ID!, subject: String!, body: String!, toId: ID!,readAt:DateTime!, senderId:ID!, ccIds: [Int], parentId: ID!): Message!
  updateMessage(id: ID!, subject: String!, body: String!, readAt: DateTime): Message!
  deleteMessage(id: ID!): Message!

  createDraft(subject: String!, userId: ID!, messageId: ID!): Draft!
  updateDraft(id: ID!, subject: String!, deletedAt: DateTime!): Draft!
  deleteDraft(id: ID!): Draft!

 
  createAttachment(attachment: Upload!, userId: ID!, messageId: ID!): Attachment!
  updateAttachment(id: ID!, fileName: String!, mimeType: String!, data: Bytes): Attachment!
  deleteAttachment(id: ID!): Attachment!
  
}


`
module.exports = typeDefs