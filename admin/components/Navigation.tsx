import { Menu } from '@contember/admin'

export const Navigation = () => (
	<Menu>
		<Menu.Item>
			<Menu.Item title="Home page" to="homePage" />
			<Menu.Item title="Pinned recipes page" to="pinnedRecipesPage" />
			<Menu.Item title="Users" to="userList" />
			<Menu.Item title="Recipes" to="recipeList" />
			<Menu.Item title="Categories" to="categoryList" />
			<Menu.Item title="Settings">
				<Menu.Item title="General" to="general" />
				<Menu.Item title="Redirect" to="redirect/list" />
				<Menu.Item title="Locales" to="localesPage" />
				<Menu.Item title="Translations" to="translations" />
			</Menu.Item>
		</Menu.Item>
	</Menu>
)
