const { PrismaClient } = require('@prisma/client');
const { createReadStream, filename, mimetype, encoding } = require('graphql-upload');
const fs = require('fs');
const { parseInt } = require('lodash');
const { GraphQLUpload } = require('graphql-upload');
const prisma = new PrismaClient()
const { createWriteStream } = require('fs');
const { finished } = require('stream');
const { promisify } = require('util');
const fsPromises = require('fs').promises;
const path = require('path');


const finishedPromise = promisify(finished); 

const resolvers = {

  Mutation: {

    createUser:async(_,{ username,email,password,messageId })=>{
        try{
            const user = await prisma.user.create({
                data:{
                    username,
                    email,
                    password,
                    messageId:parseInt(messageId)
                    },
                    });
                    return user;
                    }catch(error){
                     console.error('Error to create user',error);
                     throw new Error('Failed to create error')
        }
    },

    createMailbox:async(_,{ userId,mailboxName })=>{
        try{
            const createMailbox = await prisma.mailbox.create({
                data:{
                    userId:parseInt(userId),
                    mailboxName
                }
            });
            return createMailbox
        }catch(error){
            console.error('Error to create  mailbox',error)
            throw new Error('failed to create mailbox')
        }
    },

    createMessage: async (_, { userId, mailboxId, subject, body, toId, readAt, senderId, ccIds, parentId }) => {
          try {
            // Create the message first
            const createMessage = await prisma.message.create({
              data: {
                userId: parseInt(userId),
                mailboxId: parseInt(mailboxId),
                subject,
                body,
                toId: parseInt(toId),
                readAt,
                senderId: parseInt(senderId),
                parentId: parentId ? parseInt(parentId) : null,
              },
            });
    
            // If there are ccIds, create Cc entries
            if (ccIds && ccIds.length > 0) {
              const ccEntries = ccIds.map(ccId => ({
                messageId: createMessage.id,
                userId: parseInt(ccId),
              }));
    
              await prisma.cc.createMany({
                data: ccEntries,
              });
            }
    
            return createMessage;
          } catch (error) {
            console.error('Error to failed create message', error);
            throw new Error('Failed to create message');
          }
        },
        createDraft:async(_, { subject, userId, messageId })=>{
            try{
                const createDraft =await prisma.draft.create({
                    data:{
                        subject,
                        userId:parseInt(userId),
                        messageId:messageId?parseInt(messageId):null
                    }
                });return createDraft
            }catch(error){
                console.error('Error to create draft',error);
                throw new Error('Failed to create draft')
            }
        },
        createAttachment : async (_, { attachment, userId, messageId }) => {
          try {
              // Ensure attachment exists and has the necessary properties
              if (!attachment || !attachment.file || !attachment.file.createReadStream) {
                  throw new Error('Invalid attachment object');
              }
              const { file } = attachment;
              const { createReadStream, filename, mimetype } = file;
              if (!filename) {
                  throw new Error('Filename is required');
              }
              const uploadsDir = path.join(__dirname, 'uploads');
              const filePath = path.join(uploadsDir, filename);
      
              // Ensure the uploads directory exists
              await fsPromises.mkdir(uploadsDir, { recursive: true });
      
              // Write the file to the file system
              const writeStream = createWriteStream(filePath);
              createReadStream().pipe(writeStream);
              await finishedPromise(writeStream); // Await the finished promise
      
              // Read the file content
              const fileData = await fsPromises.readFile(filePath);
              const base64Data = fileData.toString('base64'); 
      
              // Create a new attachment in the database
              const newAttachment = await prisma.attachment.create({
                  data: {
                      fileName: filename,
                      mimeType: mimetype,
                      userId: userId ? parseInt(userId) : null,
                      messageId: parseInt(messageId),
                      data: base64Data,
                  },
              });
      
              return newAttachment;
          } catch (error) {
              console.error('Error creating attachment', error);
              throw new Error('Failed to create attachment');
          }
      },
      }, 
  }

module.exports = resolvers;
