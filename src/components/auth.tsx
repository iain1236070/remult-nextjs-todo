import { signIn, signOut, useSession } from "next-auth/react"
import { useEffect } from "react"
import { UserInfo, remult } from "remult"
import Todo from "./todo"
import ably from "ably/promises"
import { AblySubscriptionClient } from "remult/ably"

export default function Auth() {
  const session = useSession()
  remult.user = session.data?.user as UserInfo

  useEffect(() => {
    if (session.status === "unauthenticated") signIn()
    else if (session.status === "authenticated")
      remult.apiClient.subscriptionClient = new AblySubscriptionClient(
        new ably.Realtime({ authUrl: "/api/getAblyToken", authMethod: "POST" })
      )
  }, [session])
  if (session.status !== "authenticated") return <></>
  return (
    <div>
      Hello {remult.user?.name}{" "}
      <button onClick={() => signOut()}>Sign Out</button>
      <Todo />
    </div>
  )
}
