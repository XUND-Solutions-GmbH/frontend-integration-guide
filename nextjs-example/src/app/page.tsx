import { XUND } from "./xund-app"

export default async function Home() {


  const clientCredentials = {
    clientId: process.env.XUND_AUTH_CLIENT_ID,
    clientSecret: process.env.XUND_AUTH_CLIENT_SECRET,
    grant_type: 'client_credentials',
    scope: 'state' 
  }
  
  const tokenRequest = await fetch(
    `${process.env.XUND_AUTH_BASE_URL}/token`, 
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(clientCredentials)
    }  
  );
  const tokenRequestJson = await tokenRequest.json()
  const { access_token } = tokenRequestJson

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Example Company
        </p>
        <div className="fixed py-16 bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
          Demo implementation of XUND SC/IC/HC WebApp Module
        </div>
      </div>

      <div style={{width: '100vw', height: '100vh'}}>
        <XUND client-id={process.env.XUND_AUTH_CLIENT_ID} webapp-code={process.env.XUND_WEBAPP_CODE} token={access_token} />
      </div>

      <div className="mb-32 mt-16 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
        Footer of Example Company
      </div>
    </main>
  );

}
