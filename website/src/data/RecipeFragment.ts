import type { GraphQLTypes, InputType } from '../../generated/contember'
import { Selector } from '../../generated/contember'
import type { scalarResolver } from '../utilities/createScalarResolver'
import { ImageFragment } from './ImageFragment'

export const RecipeFragment = (locale: string) =>
	Selector('Recipe')({
		id: true,
		// createdBy:[{}, {}],
		// pinnedRecipes: [{}, {}]
		publishDate: true,
		price: true,
		mainImage: [{}, ImageFragment()],
		// stepsGroups: [{}, {}]
		localesByLocale: [
			{ by: { locale: { code: locale } } },
			{
				title: true,
				description: true,
			},
		],
	})

export type RecipeResult = InputType<GraphQLTypes['Recipe'], ReturnType<typeof RecipeFragment>, typeof scalarResolver>