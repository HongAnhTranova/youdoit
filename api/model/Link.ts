import { AclDefinition as acl, SchemaDefinition as d } from '@contember/schema-definition'
import { publicRole } from './acl'
import { Linkable } from './Linkable'

export const LinkType = d.createEnum('internal', 'external')

@acl.allow(publicRole, { read: true })
export class Link {
	type = d.enumColumn(LinkType).notNull()
	title = d.stringColumn()
	externalLink = d.stringColumn()
	internalLink = d.manyHasOne(Linkable).setNullOnDelete()
}
