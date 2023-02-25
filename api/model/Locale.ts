import { AclDefinition as acl, SchemaDefinition as d } from '@contember/schema-definition'
import { publicRole } from './acl'
import { CategoryLocale } from './Category'
import { HomePageLocale } from './HomePage'
import { RecipeLocale } from './Recipe'
import { StepLocale } from './Step'
import { StepGroupLocale } from './StepGroup'
import { TipLocale } from './Tip'

@acl.allow(publicRole, { read: true })
export class Locale {
	code = d.stringColumn().notNull().unique()
	label = d.stringColumn()

	homePage = d.oneHasMany(HomePageLocale, 'locale')

	recipes = d.oneHasMany(RecipeLocale, 'locale')
	categories = d.oneHasMany(CategoryLocale, 'locale')
	stepsGroups = d.oneHasMany(StepGroupLocale, 'locale')
	stipGroups = d.oneHasMany(StepGroupLocale, 'locale')
	steps = d.oneHasMany(StepLocale, 'locale')
	tips = d.oneHasMany(TipLocale, 'locale')
}
