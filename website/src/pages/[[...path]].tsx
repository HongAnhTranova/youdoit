import { One, OrderDirection } from '../../generated/contember'
import { Layout } from '../components/Layout'
import type { LocaleSwitcherProps } from '../components/LocaleSwitcher'
import { CategoryPage } from '../components/pages/CategoryPage'
import { HomePage } from '../components/pages/HomePage'
import { PinnedRecipesPage } from '../components/pages/PinnedRecipesPage'
import { RecipeDetailPage } from '../components/pages/RecipeDetailPage'
import { UserPage } from '../components/pages/UserPage'
import { Seo } from '../components/Seo'
import { TranslationsProvider } from '../contexts/TranslationsContext'
import { CategoryLocaleFragment } from '../data/CategoryLocaleFragment'
import { HomePageLocaleFragment } from '../data/HomePageLocaleFragment'
import { PinnedRecipesPageLocaleFragment } from '../data/PinnedRecipesLocaleFragment'
import { RecipeLocaleFragment } from '../data/RecipeLocaleFragment'
import { TranslationsEntryFragment } from '../data/TranslationsEntryFragment'
import { UserFragment } from '../data/UserFragment'
import { contember } from '../utilities/contember'
import { scalarResolver } from '../utilities/createScalarResolver'
import { getLinkableUrlFromContext } from '../utilities/getLinkableUrlFromContext'
import type { InferDataLoaderProps } from '../utilities/handlers'
import { handleGetStaticPaths, handleGetStaticProps } from '../utilities/handlers'
import { hardcodedUserEmail } from '../utilities/hardcodedUserEmail'

export type PageProps = InferDataLoaderProps<typeof getStaticProps>

export default function ({
	locale,
	seo,
	homePage,
	pinnedRecipesPage,
	homePageUrl,
	pinnedRecipesPageUrl,
	userPageUrl,
	currentUrlPage,
	categoryPage,
	recipeDetailPage,
	recipes,
	categories,
	translations,
	user,
}: PageProps) {
	const page = (homePage || pinnedRecipesPage || categoryPage || recipeDetailPage) ?? homePage

	console.log(page)

	const localeSwitcher: LocaleSwitcherProps = {
		activeLocale: locale,
		pageLocales: page?.base?.locales,
	}

	return (
		<TranslationsProvider
			translationsEntries={Object.fromEntries(
				translations.map((translationEntry) => {
					return [translationEntry.key, translationEntry.valuesByLocale?.value ?? translationEntry.key]
				}),
			)}
		>
			<Layout
				homePageUrl={homePageUrl}
				pinnedRecipesPageUrl={pinnedRecipesPageUrl}
				userPageUrl={userPageUrl}
				currentPageUrl={currentUrlPage}
			>
				<Seo {...seo} />
				{homePage && recipes && <HomePage homePage={homePage} recipes={recipes} categories={categories} />}
				{pinnedRecipesPage && <PinnedRecipesPage pinnedrecipesPage={pinnedRecipesPage} locale={locale} />}
				{categoryPage && <CategoryPage categoryPage={categoryPage} allRecipesLink={homePageUrl} />}
				{recipeDetailPage && (
					<RecipeDetailPage recipeDetailPage={recipeDetailPage} allRecipesLink={pinnedRecipesPageUrl} />
				)}
				{user && currentUrlPage === userPageUrl && (
					<UserPage user={user} pinnedRecipesPageUrl={pinnedRecipesPageUrl} localeSwitcher={localeSwitcher} />
				)}
			</Layout>
		</TranslationsProvider>
	)
}

export const getStaticPaths = handleGetStaticPaths(async (context) => {
	const { listLinkable } = await contember('query', { scalars: scalarResolver })({
		listLinkable: [
			{
				// filter: {
				// 	redirect: { id: { isNull: true } },
				// },
			},
			{
				id: true,
				url: true,
			},
		],
	})

	return {
		paths: listLinkable.map((link) => {
			const path = link.url.split('/').filter((part) => part !== '')

			let locale: string | undefined

			if (context.locales?.includes(path[0])) {
				locale = path.shift()
			}

			return {
				locale,
				params: {
					path,
				},
			}
		}),
		fallback: 'blocking',
	}
})

export const getStaticProps = handleGetStaticProps(async (context) => {
	const url = getLinkableUrlFromContext(context)

	const { locale } = context

	if (!locale) {
		throw new Error('Locale not defined.')
	}

	const data = await contember('query', { scalars: scalarResolver })({
		listCategoryLocale: [{ orderBy: [{ base: { order: OrderDirection.asc } }] }, CategoryLocaleFragment(locale)],
		listRecipeLocale: [{ orderBy: [{ base: { publishDate: OrderDirection.desc } }] }, RecipeLocaleFragment(locale)],
		getLinkable: [
			{
				by: { url },
			},
			{
				url: true,
				homePage: [{}, HomePageLocaleFragment()],
				pinnedRecipesPage: [{}, PinnedRecipesPageLocaleFragment()],
				category: [{}, CategoryLocaleFragment(locale)],
				recipe: [{}, RecipeLocaleFragment(locale)],
				user: [{}, UserFragment()],
				// genericPage: [{}, GenericPageFragment()],
				// redirect: [
				// 	{},
				// 	{
				// 		id: true,
				// 		target: [{}, LinkFragment()],
				// 	},
				// ],
			},
		],
		getHomePageLocale: [{ by: { locale: { code: locale }, base: { unique: One.One } } }, { link: [{}, { url: true }] }],
		getPinnedRecipesPageLocale: [
			{ by: { locale: { code: locale }, base: { unique: One.One } } },
			{ link: [{}, { url: true }] },
		],
		getUser: [{ by: { email: hardcodedUserEmail } }, UserFragment()],
	})

	// const redirectUrl = (() => {
	// 	const target = data.getLinkable?.redirect?.target
	// 	return target ? contemberLinkToHref(target) : null
	// })()

	// if (redirectUrl) {
	// 	return {
	// 		redirect: {
	// 			permanent: false,
	// 			destination: redirectUrl,
	// 		},
	// 	}
	// }

	const canonicalUrl = (() => {
		const url = data.getLinkable?.url
		if (!url) {
			return null
		}
		return (process.env.NEXT_PUBLIC_WEB_URL ?? '') + url
	})()

	if (!data.getLinkable) {
		return {
			notFound: true,
		}
	}
	const { homePage, pinnedRecipesPage, category, recipe } = data.getLinkable

	const translations = await contember('query', { scalars: scalarResolver })({
		listTranslationsEntry: [{}, TranslationsEntryFragment(locale)],
	})

	return {
		props: {
			locale,
			homePage,
			pinnedRecipesPage,
			homePageUrl: data.getHomePageLocale?.link?.url ?? null,
			pinnedRecipesPageUrl: data.getPinnedRecipesPageLocale?.link?.url ?? null,
			userPageUrl: data.getUser?.link?.url ?? null,
			currentUrlPage: data.getLinkable.url,
			categoryPage: category,
			recipeDetailPage: recipe,
			categories: data.listCategoryLocale,
			recipes: data.listRecipeLocale,
			translations: translations.listTranslationsEntry,
			user: data.getUser,
			seo: {
				canonicalUrl,
				// seo: {
				// 	...(data.getGeneral?.seo ?? {}),
				// 	...Object.fromEntries(Object.entries(page.seo ?? {}).filter(([_, value]) => Boolean(value))),
				// },
			},
		},
		revalidate: 60,
	}
})
