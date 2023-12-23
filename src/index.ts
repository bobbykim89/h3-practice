import { createServer } from 'node:http'
import { toNodeListener } from 'h3'
import { app } from './main'

createServer(toNodeListener(app)).listen(process.env.PORT || 3000)
