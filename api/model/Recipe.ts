import { AclDefinition as acl, SchemaDefinition as d } from '@contember/schema-definition'
import { publicRole } from './acl'
import { Category } from './Category'
import { Image } from './Image'
import { Linkable } from './Linkable'
import { Locale } from './Locale'
import { PinnedRecipe } from './PinnedRecipe'
import { StepGroup } from './StepGroup'
import { User } from './User'

@acl.allow(publicRole, { read: true })
export class Recipe {
	locales = d.oneHasMany(RecipeLocale, 'base')

	createdBy = d.manyHasOne(User, 'createdRecipes').cascadeOnDelete().notNull()
	pinnedRecipes = d.oneHasMany(PinnedRecipe, 'derivedBy')

	categories = d.manyHasMany(Category, 'recipes')

	publishDate = d.dateColumn()
	price = d.stringColumn()
	mainImage = d.manyHasOne(Image)
	tileImage = d.manyHasOne(Image)
	stepsGroups = d.oneHasMany(StepGroup, 'recipe')
	tipGroups = d.oneHasMany(StepGroup, 'recipe')
}
@d.Unique('base', 'locale')
@acl.allow(publicRole, { read: true })
export class RecipeLocale {
	base = d.manyHasOne(Recipe, 'locales').notNull().cascadeOnDelete()
	locale = d.manyHasOne(Locale, 'recipes').cascadeOnDelete().notNull()

	link = d.oneHasOneInverse(Linkable, 'recipe').notNull()
	title = d.stringColumn()
	tileDescription = d.stringColumn()
	description = d.stringColumn()
}
