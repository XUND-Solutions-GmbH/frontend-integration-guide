import Script from "next/script"
import { createHmac } from 'crypto'
import React from "react";

export default async function Home() {

  const state = crypto.randomUUID?.() ?? crypto.getRandomValues(new Uint32Array(40)).join('')

  const hashCreator = createHmac('sha256', process.env.XUND_AUTH_API_KEY ?? '')
  hashCreator.update(`${state}${process.env.XUND_AUTH_CLIENT_ID}`)
  const secretHash = hashCreator.digest('hex')

  const authorizeResponse = await fetch(
    `${process.env.XUND_AUTH_BASE_URL}/authorize?clientId=${process.env.XUND_AUTH_CLIENT_ID}&secretHash=${secretHash}&state=${state}`,
  );

  const authorizeResponseJson = await authorizeResponse.json()

  if (!authorizeResponse.ok) {
    throw new Error(`${authorizeResponse.status} ${JSON.stringify(authorizeResponseJson)}`)
  }

  const {authCode} = authorizeResponseJson

  type XUNDContainerProps = React.ComponentProps<'div'> & {
    'id':'xund-app-placeholder'
    'client-id'?: string
    'auth-code'?: string
    'webapp-code'?: string
    'webapp-base-url'?: string
    'auth-base-url'?: string
    'gender'?: string
    'birth'?: string
  };
  
  const XUNDContainer = ({ ...props }: XUNDContainerProps) => {
    return <div {...props} ></div>;
  };

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

        <XUNDContainer
          id="xund-app-placeholder" 
          client-id={process.env.XUND_AUTH_CLIENT_ID}
          webapp-code={process.env.XUND_WEBAPP_CODE}
          auth-code={authCode}
          auth-base-url={process.env.XUND_AUTH_BASE_URL}
          webapp-base-url={process.env.XUND_WEBAPP_BASE_URL}
        />

        <Script src="https://public.xund.solutions/embed.js" />

      </div>

      <div className="mb-32 mt-16 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
        Footer of Example Company
      </div>
    </main>
  );

}
