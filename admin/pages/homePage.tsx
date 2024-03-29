import { EditPage, TextField, useEnvironment } from '@contember/admin'
import { LinkUrlField } from '../components/LinkUrlField'
import { LocaleSideDimension } from '../components/LocaleSideDimensions'
import { SeoField } from '../components/SeoField'

export default () => {
	const enviroment = useEnvironment()

	return (
		<EditPage entity="HomePage(unique = One)" rendererProps={{ title: 'Home page' }}>
			<LocaleSideDimension>
				<LinkUrlField derivedFrom="seo.title" />
				<TextField field="title" label="Title" />
				<SeoField field="seo" />
			</LocaleSideDimension>
		</EditPage>
	)
}
