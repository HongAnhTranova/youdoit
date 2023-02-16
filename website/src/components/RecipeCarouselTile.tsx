import Image from 'next/image'
import type { FunctionComponent } from 'react'
import type { RecipeResult } from '../data/RecipeFragment'
import { PriceTag } from './PriceTag'
import styles from './RecipeCarouselTile.module.sass'

export type RecipeCarouselTileProps = {
	tile: RecipeResult
}

export const RecipeCarouselTile: FunctionComponent<RecipeCarouselTileProps> = ({ tile }) => {
	return (
		<div className={styles.wrapper}>
			{tile.mainImage?.url && (
				<div className={styles.image}>
					<Image src={tile.mainImage?.url} alt="" fill />
				</div>
			)}
			<div className={styles.content}>
				<div className={styles.title}>{tile.localesByLocale?.title}</div>
				{tile.price && (
					<div className={styles.price}>
						<PriceTag price={tile.price} />
					</div>
				)}
			</div>
		</div>
	)
}