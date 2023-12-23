import 'dotenv/config'
import { connect } from 'mongoose'

const MongoUrl = `mongodb+srv://${process.env.MONGO_ADMIN_ID}:${process.env.MONGO_ADMIN_PW}@practice-cluster.89vcofi.mongodb.net/test-cluster?retryWrites=true&w=majority`

export const connectDB = async () => {
  try {
    await connect(MongoUrl)
    console.log('MongoDB Connected')
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}
