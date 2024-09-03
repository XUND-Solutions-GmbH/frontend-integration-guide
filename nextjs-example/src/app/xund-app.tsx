'use client'

import { useCallback, useEffect, useRef } from 'react';

interface XUNDProps {
	"client-id": string | undefined,
	"webapp-code"?: string,
	"token"?: string,

	"state"?: string,
	"direct-check"?: string,
	"check-id"?: string,
	"birth"?: string,
	"gender"?: string,
}

export const XUND = (props:XUNDProps) => {

	const ref = useRef(null)
	const initialized = useRef(false)

	const appendSearchParamsIfSet = (url:URL, searchParams:{[key:string]:string|null|undefined}) => {
    for (const [name, value] of Object.entries(searchParams)) {
      if (value) { url.searchParams.append(name, value); }
    }
  }


	const authorize = useCallback(async() => {
		const clientId = props['client-id'] ?? process.env.XUND_AUTH_CLIENT_ID
		
		const authCode = crypto.randomUUID?.() ?? crypto.getRandomValues(new Uint32Array(40)).join('')
		const webappCode = props['webapp-code'] ?? ''

		const state = props['state'] ?? ''
		
		if(!props.token) {
      const authorizeRequestUrl = new URL(`${process.env.XUND_AUTH_BASE_URL}/authorize`)
      appendSearchParamsIfSet(authorizeRequestUrl, { clientId, authCode, state, scope: 'state' })
      await fetch(authorizeRequestUrl)
    }

		if(ref.current){

			const iframeNode:HTMLIFrameElement = ref.current

			const urlParams = new URLSearchParams(document.location.search)

			const state = props['state'] || urlParams.get('state');
			const checkId = props['check-id'] || urlParams.get('checkId');
			const directCheck = props['direct-check'] || urlParams.get('directCheck');
			const birth = props['birth'] || urlParams.get('birth');
			const gender = props['gender'] || urlParams.get('gender'); 

			const webappUrl = new URL(`${process.env.XUND_APP_BASE_URL}/${webappCode}`)
    	appendSearchParamsIfSet(webappUrl, { birth, gender, checkId, state, directCheck })
			
			iframeNode.src = props.token ? 
      `
        ${process.env.XUND_APP_BASE_URL}/${webappCode}#${props.token}
      `
      :
      `
        ${process.env.XUND_AUTH_BASE_URL}/token
        ?clientId=${clientId}
        &authCode=${authCode}
        &state=${state}
        &redirectUri=${encodeURIComponent(
          webappUrl.toString(),
        )}
      `
		}
	}, [props])
	
	const replyOriginProof = () => {
		window.addEventListener( "message", (event) => {
			if (event.origin !== process.env.XUND_APP_BASE_URL || !event.data.check || ref.current === null) return;
			
			(ref.current as HTMLIFrameElement).contentWindow?.postMessage(event.data, process.env.XUND_APP_BASE_URL);
			
		}, false);
		
	}
	
	useEffect(() => {
		if(!initialized.current) {
			
			authorize()
			replyOriginProof()
			
			initialized.current = true
		}
	},[authorize])

	return <iframe ref={ref} allow="geolocation" style={{width: '100%', height: '100%', border: 'none' }} title="XUND Application Frame"/>
}