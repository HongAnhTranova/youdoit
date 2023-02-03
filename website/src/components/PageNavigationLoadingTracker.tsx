import { useRouter } from 'next/router'
import type { FunctionComponent } from 'react'
import { useEffect } from 'react'
import { useLocalLoading } from 'shared-loading-indicator'

export const PageNavigationLoadingTracker: FunctionComponent = () => {
	const router = useRouter()
	const [_, setIsLoading] = useLocalLoading()

	useEffect(() => {
		const handleStart = (url: string) => {
			url !== router.pathname ? setIsLoading(true) : setIsLoading(false)
		}
		const handleComplete = () => setIsLoading(false)

		router.events.on('routeChangeStart', handleStart)
		router.events.on('routeChangeComplete', handleComplete)
		router.events.on('routeChangeError', handleComplete)

		return () => {
			router.events.off('routeChangeStart', handleStart)
			router.events.off('routeChangeComplete', handleComplete)
			router.events.off('routeChangeError', handleComplete)
		}
	}, [router, setIsLoading])

	return null
}
