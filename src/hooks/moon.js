import { AccountResponse } from '@moonup/moon-api';
import { MoonSDK } from '@moonup/moon-sdk';
import { AUTH, MOON_SESSION_KEY, Storage } from '@moonup/moon-types';
import { useEffect, useState,useCallback } from 'react';



export default function useMoonSDK() {
	const [moon, setMoon] = useState(null);

	const initialize = async () => {
		const moonInstance = new MoonSDK({
			Storage: {
				key: MOON_SESSION_KEY,
				type: Storage.SESSION,
			},
			Auth: {
				AuthType: AUTH.JWT,
			},
		});
		setMoon(moonInstance);
		moonInstance.login();
	};

	const disconnect = async () => {
		if (moon) {
			await moon.disconnect();
			setMoon(null);
		}
	};
	const listAccounts = async () => {
		if (moon) {
			return moon.listAccounts();
		}
	};
	const updateToken = useCallback(
		async (token) => {
		  if (moon) {
			await moon.updateToken(token);
		  }
		},
		[moon]
	  );


	useEffect(() => {
		initialize();
	}, []);

	return {
		moon,
		initialize,
		disconnect,
		listAccounts,
		updateToken,
	};
}
