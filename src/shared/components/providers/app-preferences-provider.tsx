"use client";

import { createContext, useContext } from "react";
import type { AppPreferences } from "@/shared/lib/preferences/queries";

const DEFAULT_APP_PREFERENCES: AppPreferences = {
	showTransactionSummary: true,
};

const AppPreferencesContext = createContext<AppPreferences>(
	DEFAULT_APP_PREFERENCES,
);

type AppPreferencesProviderProps = AppPreferences & {
	children: React.ReactNode;
};

export function AppPreferencesProvider({
	children,
	...preferences
}: AppPreferencesProviderProps) {
	return (
		<AppPreferencesContext.Provider value={preferences}>
			{children}
		</AppPreferencesContext.Provider>
	);
}

export function useAppPreferences() {
	return useContext(AppPreferencesContext);
}
