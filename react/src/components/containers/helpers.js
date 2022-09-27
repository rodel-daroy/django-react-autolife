import React from "react";
import Tile from "components/Tiles/Tile";
import TileContent from "components/Tiles/TileContent";
import { 
	defaultButtonText, 
	defaultImageUrl, 
	defaultHeadline, 
	defaultSubheading, 
	defaultCtaLink 
} from "config/constants";
import ALPollsView from "components/ALPolls/ALPollsView";
import TileSlot from "components/Tiles/TileSlot";

const getArticleSlug = article => {
  if(article && typeof article === 'object')
    return article.article_slug;

  return article;
}

const tilesBasedOnCTALink = (tile, kind, animate) => {
  const tileAsset = tile.tile_asset[0];
  if (tile.linked_outside) {
    return (
      <Tile
        videoWallpaper={{ src: tileAsset.asset_url }}
        video={{ src: tileAsset.asset_url, type: "video/mp4" }}
        animate={animate}
        href={
          tile.tile_cta_link
            ? tile.tile_cta_link
            : `/content/${getArticleSlug(tile.tile_cta_article)}`
        }
      >
        <TileContent
          logo={tile.sponsor ? tile.sponsor.logo : null}
          title={tile.tile_headline}
          kind={kind}
          text={tile.tile_subheadline}
          buttonText={tile.tile_cta_text || defaultButtonText}
        />
      </Tile>
    );
  }
  return (
    <Tile
      videoWallpaper={{ src: tileAsset.asset_url }}
      href={
        tile.tile_cta_link
          ? tile.tile_cta_link
          : `/content/${getArticleSlug(tile.tile_cta_article)}`
      }
      animate={animate}
    >
      <TileContent
        logo={tile.sponsor ? tile.sponsor.logo : null}
        title={tile.tile_headline}
        kind={kind}
        text={tile.tile_subheadline}
        buttonText={tile.tile_cta_text || defaultButtonText}
      />
    </Tile>
  );
};

const tilesAssetTypeImage = (tileAsset, ctaLink, tile, ctaTarget, kind, animate) => {
  if (tile.linked_outside) {
    return (
      <Tile
        imageUrl={tileAsset.asset_url || defaultImageUrl}
        href={ctaLink}
        target="_blank"
        animate={animate}
      >
        <TileContent
          logo={tile.sponsor ? tile.sponsor.logo : null}
          title={tile.tile_headline || defaultHeadline}
          text={tile.tile_subheadline || defaultSubheading}
          kind={kind}
          buttonText={tile.tile_cta_text || defaultButtonText}
        />
      </Tile>
    );
  }
  return (
    <Tile
      imageUrl={tileAsset.asset_url || defaultImageUrl}
      to={ctaLink || defaultCtaLink}
      animate={animate}
    >
      <TileContent
        logo={tile.sponsor ? tile.sponsor.logo : null}
        title={tile.tile_headline || defaultHeadline}
        text={tile.tile_subheadline || defaultSubheading}
        kind={kind}
        buttonText={tile.tile_cta_text || defaultButtonText}
      />
    </Tile>
  );
};

const getTileType = (tile, kind, animate) => {
  const ctaTarget = !!tile.tile_cta_link;
  const ctaLink = ctaTarget
    ? tile.tile_cta_link
    : `/content/${getArticleSlug(tile.tile_cta_article)}`;
  if ((tile.tile_asset || []).length > 0) {
    const tileAsset = tile.tile_asset[0];
    if (tileAsset.asset_type === "video") {
      return tilesBasedOnCTALink(tile, kind, animate);
    }
    return tilesAssetTypeImage(
      tileAsset,
      ctaLink,
      tile,
      ctaTarget,
      kind,
      animate
    );
  }

  return tilesAssetTypeImage({}, ctaLink, tile, ctaTarget, kind, animate);
};

const clampSize = size => Math.min(Math.max(size, 1), 2);

export const getTiles = (tilesData, animate) => {
  let tiles = [];

  for (let i = 0; i < tilesData.length; ++i) {
    const tile = tilesData[i];

    let tileType;
    if (typeof tile.poll_tile === "object") {
      tileType = <ALPollsView size={clampSize(tile.columns)} key={i} tile={tile} />;
    } else tileType = getTileType(tile, clampSize(tile.columns), animate);

    if (tileType)
      tiles.push(
        <TileSlot size={clampSize(tile.columns)} key={i}>
          {tileType}
        </TileSlot>
      );
  }
  return tiles;
};