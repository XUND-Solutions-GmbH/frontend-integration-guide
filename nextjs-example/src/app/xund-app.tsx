'use client'

import { useCallback, useEffect, useRef } from 'react';

interface XUNDProps {
  "client-id": string | undefined,
  "webapp-code"?: string,
  "token"?: string,

  "state"?: string,
  "direct-check"?: 'HEALTH_CHECK' | 'ILLNESS_CHECK' | 'SYMPTOM_CHECK',
  "check-id"?: string,
  "birth"?: string,
  "gender"?: 'male' | 'female',
}

export const authKeys = {
  BE: 0,
  FE: 1,
}

export const XUND = (props:XUNDProps) => {

  const ref = useRef(null)
  const initialized = useRef(false)
  const authType = !!props.token ? authKeys.BE : authKeys.FE

  const appendSearchParamsIfSet = (url:URL, searchParams:{[key:string]:string|null|undefined}) => {
    for (const [name, value] of Object.entries(searchParams)) {
      if (value) { url.searchParams.append(name, value); }
    }
  }

  const setWebAppURL = useCallback(async() => {
    const clientId = props['client-id'] ?? process.env.XUND_AUTH_CLIENT_ID
    const webappCode = props['webapp-code'] ?? ''

    const urlParams = new URLSearchParams(document.location.search)
    const state = props['state'] || urlParams.get('state') || ''
    const authCode = crypto.randomUUID?.() ?? crypto.getRandomValues(new Uint32Array(40)).join('')
    
    if(authType === authKeys.FE) { 
      const authorizeRequestUrl = new URL(`${process.env.XUND_AUTH_BASE_URL}/authorize`)
      appendSearchParamsIfSet(authorizeRequestUrl, { clientId, authCode, state, scope: 'state' })
      await fetch(authorizeRequestUrl)
    }

    if(ref.current){

      const iframeNode:HTMLIFrameElement = ref.current

      const checkId = props['check-id'] || urlParams.get('checkId');
      const directCheck = props['direct-check'] || urlParams.get('directCheck');
      const birth = props['birth'] || urlParams.get('birth');
      const gender = props['gender'] || urlParams.get('gender'); 

      const webappUrl = new URL(`${process.env.XUND_APP_BASE_URL}/${webappCode}`)
      appendSearchParamsIfSet(webappUrl, { birth, gender, checkId, state, directCheck })
      
      iframeNode.src = authType === authKeys.BE ? 
        `${webappUrl}#${props.token}`
        :
        `${process.env.XUND_AUTH_BASE_URL}/token
        ?clientId=${clientId}
        &authCode=${authCode}
        &state=${state}
        &redirectUri=${encodeURIComponent(
          webappUrl.toString(),
        )}`
    }
  }, [authType, props])
  
  const replyOriginProof = () => {
    window.addEventListener( "message", (event) => {
      if (event.origin !== process.env.XUND_APP_BASE_URL || !event.data.check || ref.current === null) return;
      
      (ref.current as HTMLIFrameElement).contentWindow?.postMessage(event.data, process.env.XUND_APP_BASE_URL);
      
    }, false);
    
  }
  
  useEffect(() => {
    if(!initialized.current) {
      
      setWebAppURL()

      if(authType === authKeys.FE) {
        replyOriginProof()
      }
      
      initialized.current = true
    }
  }, [authType, setWebAppURL])

  return <iframe ref={ref} allow="geolocation" style={{width: '100%', height: '100%', border: 'none' }} title="XUND Application Frame"/>
}