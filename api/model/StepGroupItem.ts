import { AclDefinition as acl, SchemaDefinition as d } from '@contember/schema-definition'
import { publicRole } from './acl'
import { Step } from './Step'
import { StepGroup } from './StepGroup'
import { Tip } from './Tip'

export const StepGroupItemType = d.createEnum('step', 'tip')

@acl.allow(publicRole, { read: true })
export class StepGroupItem {
	type = d.enumColumn(StepGroupItemType).notNull()
	group = d.manyHasOne(StepGroup, 'items').cascadeOnDelete().notNull()
	order = d.intColumn().notNull().default(0)

	step = d.oneHasOne(Step).setNullOnDelete()
	tip = d.oneHasOne(Tip).setNullOnDelete()
}
