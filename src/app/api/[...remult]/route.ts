import { remultNextApp } from "remult/remult-next"
import { Task } from "../../../shared/Task"
import { TasksController } from "../../../shared/TaskController"
import { getUserOnServer } from "../auth/[...nextauth]/route"
import { createPostgresDataProvider } from "remult/postgres"
import ably from "ably/promises"
import { AblySubscriptionServer } from "remult/ably"
import { DataProviderLiveQueryStorage } from "remult/server"
const dataProvider = createPostgresDataProvider({
  connectionString: process.env["POSTGRES_URL"] || process.env["DATABASE_URL"],
  configuration: {
    ssl: Boolean(process.env["POSTGRES_URL"]),
  },
})
const api = remultNextApp({
  entities: [Task],
  controllers: [TasksController],
  getUser: getUserOnServer,
  subscriptionServer: new AblySubscriptionServer(
    new ably.Rest(process.env["ABLY_API_KEY"]!)
  ),
  dataProvider,
  liveQueryStorage: new DataProviderLiveQueryStorage(dataProvider),
})

export const { POST, PUT, DELETE, GET } = api
