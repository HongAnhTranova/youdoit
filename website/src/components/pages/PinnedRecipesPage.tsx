import { useQuery } from '@tanstack/react-query'
import type { FunctionComponent } from 'react'
import { useMirrorLoading } from 'shared-loading-indicator'
import type { PinnedRecipesPageLocaleResult } from '../../data/PinnedRecipesLocaleFragment'
import { contember } from '../../utilities/contember'
import { scalarResolver } from '../../utilities/createScalarResolver'
import { hardcodedUserEmail } from '../../utilities/hardcodedUserEmail'
import { Container } from '../Container'
import styles from './PinnedRecipesPage.module.sass'

export interface PinnedRecipesPageProps {
	pinnedrecipesPage: PinnedRecipesPageLocaleResult
	locale: string
}

export const PinnedRecipesPage: FunctionComponent<PinnedRecipesPageProps> = ({ pinnedrecipesPage, locale }) => {
	const recipes = useQuery([hardcodedUserEmail], async () => {
		const data = await contember('query', { scalars: scalarResolver })({
			listPinnedRecipe: [
				{ filter: { user: { email: { eq: hardcodedUserEmail } } } },
				{
					id: true,
					derivedBy: [
						{},
						{
							localesByLocale: [{ by: { locale: { code: locale } } }, { title: true, link: [{}, { url: true }] }],
						},
					],
				},
			],
		})
		return data.listPinnedRecipe
	})

	useMirrorLoading(recipes.isLoading)
	return (
		<Container>
			<div className={styles.wrapper}>
				<div className={styles.title}>{pinnedrecipesPage.title}</div>
			</div>
			<ul className={styles.pinnedRecipesList}>
				{recipes.data?.map((pinnedRecipe) => {
					return (
						<li key={pinnedRecipe.id}>
							<div>{pinnedRecipe.id}</div>
							<div>{pinnedRecipe.derivedBy?.localesByLocale?.title}</div>
							<div>{pinnedRecipe.derivedBy?.localesByLocale?.link?.url}</div>
						</li>
					)
				})}
			</ul>
		</Container>
	)
}
