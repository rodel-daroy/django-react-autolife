"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
"""
from django.db import models
from django.db.models import Q
from django.utils import timezone

from library.cache_store import GetValuesFromCache, SetValuesInCache
from library.constants import CONTENT_PUBLISH_STATES


class ContentManagerQuerySet(models.QuerySet):
    """
    QuerySet for ContentModelManager
    """

    def recent_articles(self):
        articles = GetValuesFromCache().recently_added_articles()
        if not articles:
            articles = [content.meta_details for content in self.all_published().order_by('-content_publish_date')]
            SetValuesInCache().set_recent_articles(articles)
        return articles

    def recent_articles2(self, start_index, end_index):
        articles = GetValuesFromCache().recently_added_articles2()
        if articles:
            total_count = len(articles)
            articles = articles[start_index:end_index]
            articles = [content.meta_details for content in articles]
            return articles, total_count

        art_data = self.all_published().order_by('-content_publish_date')

        SetValuesInCache().set_recent_articles2(art_data)
        total_count = len(art_data)
        art_data = art_data[start_index:end_index]

        articles = [content.meta_details for content in art_data]
        return articles, total_count

    def get_latest(self):
        try:
            return self.filter(is_featured=True).only(
                'slug', 'id', 'content_heading', 'asset_template_association').order_by("created_on")[0].meta_details
        except:
            return []

    def get_most_liked(self):
        return self.filter().order_by("-likes").exclude(likes=0)

    def get_most_viewed(self):
        return self.filter().order_by("-views").exclude(views=0)

    def all_published(self):
        articles = GetValuesFromCache().published_content()
        if not articles:
            articles = self.filter(publishingstate__unpublishing_on__gte=timezone.now(),
                           available_in_trends=True,
                           publishingstate__publish_state="Published",
                                   publishingstate__do_not_publish_until__lte=timezone.now()
                            ).order_by('-content_publish_date')
            SetValuesInCache().set_published_content(articles)
        return articles

    # def all_published2(self):
    #     # No cache
    #     articles = self.filter(publishingstate__unpublishing_on__gte=timezone.now(),
    #                    available_in_trends=True,
    #                    publishingstate__publish_state="Published",
    #                            publishingstate__do_not_publish_until__lte=timezone.now()
    #                     ).order_by('-content_publish_date')
    #     print("articles",articles)
    #     return articles

    def all_published2(self):
        articles = self.filter(publishingstate__unpublishing_on__gte=timezone.now(),
                           available_in_trends=True,
                           publishingstate__publish_state="Published",
                                   publishingstate__do_not_publish_until__lte=timezone.now(),content_publish_date__lte=timezone.now()
                            ) | self.filter(publishingstate__unpublishing_on=None,
                           available_in_trends=True,
                           publishingstate__publish_state="Published",
                                   publishingstate__do_not_publish_until=None,content_publish_date__lte=timezone.now()
                            )

        return articles.order_by('-content_publish_date')


class ContentModelManager(models.Manager):
    """
    Model manager for TemplateContent model
    """
    def get_queryset(self):
        return ContentManagerQuerySet(self.model, using=self._db)

    def recent_articles(self, start_index=None, end_index=None):
        return self.get_queryset().recent_articles()

    def recent_articles2(self, start_index=None, end_index=None):
        return self.get_queryset().recent_articles2(start_index, end_index)

    def get_featured(self):
        return self.get_queryset().get_latest()

    def get_popular(self):
        return self.get_queryset().get_most_liked()

    def get_liked(self):
        return self.get_queryset()

    def get_most_viewed(self):
        return self

    def all_published(self):
        return self.get_queryset().all_published()

    def all_published2(self):
        return self.get_queryset().all_published2()


class ContentPublishingQuerySet(models.QuerySet):
    """
    QuerySet for Publishing State model
    """
    def base_query(self):
        return self.filter(
            unpublishing_on__gte=timezone.now(),
            do_not_publish_until__lte=timezone.now(),
            content__available_in_trends=True
        ).order_by('-content__content_publish_date')
    def get_published(self):
        return self.base_query()

    def get_recents(self):
        return [
            article.content.meta_details for article in self.base_query()
        ]


class ContentPublishingManager(models.Manager):
    """
    Model Manager for Content publishing state
    """
    def get_queryset(self):
        return ContentPublishingQuerySet(self.model, using=self._db)

    def published_articles(self):
        return self.get_queryset().get_published()

    def recent_articles(self):
        return self.get_queryset().get_recents()


class ContentTagRelationQuerySet(models.QuerySet):
    """
    QuerySet for PublishinState model
    """
    def base_query(self):
        return self.filter(
            unpublishing_on__gte=timezone.now(), publish_state=CONTENT_PUBLISH_STATES[3],
            content__available_in_trends=True, do_not_publish_until__lte=timezone.now()
        ).prefetch_related('content')


class ContentTagRelationManager(models.Manager):

    """
    Fetching article according to weight
    """
    def get_queryset(self):
        pass




