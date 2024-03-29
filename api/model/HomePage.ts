import { AclDefinition as acl, SchemaDefinition as d } from '@contember/schema-definition'
import { Linkable } from './Linkable'
import { Locale } from './Locale'
import { One } from './One'
import { Seo } from './Seo'
import { publicRole } from './acl'

@acl.allow(publicRole, { read: true })
export class HomePage {
	unique = d.enumColumn(One).notNull().unique()
	locales = d.oneHasMany(HomePageLocale, 'base')
}

@d.Unique('base', 'locale')
@acl.allow(publicRole, { read: true })
export class HomePageLocale {
	base = d.manyHasOne(HomePage, 'locales').cascadeOnDelete().notNull()
	locale = d.manyHasOne(Locale, 'homePage').cascadeOnDelete().notNull()

	title = d.stringColumn()
	link = d.oneHasOneInverse(Linkable, 'homePage').notNull()
	seo = d.oneHasOne(Seo).setNullOnDelete()
}
