import { AclDefinition as acl, SchemaDefinition as d } from '@contember/schema-definition'
import { publicRole } from './acl'
import { Locale } from './Locale'
import { Recipe } from './Recipe'
import { TipGroupItem } from './TipGroupItem'

@acl.allow(publicRole, { read: true })
export class TipGroup {
	recipe = d.manyHasOne(Recipe, 'tipGroups').cascadeOnDelete().notNull()
	locales = d.oneHasMany(TipGroupLocale, 'base')
	order = d.intColumn().notNull()

	items = d.oneHasMany(TipGroupItem, 'group').orderBy('order')
}

@d.Unique('base', 'locale')
@acl.allow(publicRole, { read: true })
export class TipGroupLocale {
	base = d.manyHasOne(TipGroup, 'locales').cascadeOnDelete().notNull()
	locale = d.manyHasOne(Locale, 'tipGroups').cascadeOnDelete().notNull()

	title = d.stringColumn()
	description = d.stringColumn()
}
