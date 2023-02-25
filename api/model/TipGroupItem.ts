import { AclDefinition as acl, SchemaDefinition as d } from '@contember/schema-definition'
import { publicRole } from './acl'
import { Tip } from './Tip'
import { TipGroup } from './TipGroup'

@acl.allow(publicRole, { read: true })
export class TipGroupItem {
	group = d.manyHasOne(TipGroup, 'items').cascadeOnDelete().notNull()
	order = d.intColumn().notNull().default(0)
	tip = d.oneHasOne(Tip).setNullOnDelete()
}
