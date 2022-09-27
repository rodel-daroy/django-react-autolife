"""
This file was created at Smartbuzz Inc.
For more information visit http://www.smartbuzzinc.com
"""
import concurrent.futures
from operator import mul

from django.db.models import Q, QuerySet, Value

from content_manager.models import TemplateContent, ContentTagRelation
from library.cache_store import GetValuesFromCache, SetValuesInCache
from tags.models import Tag
from rest_framework.exceptions import APIException


# from iteration_utilities import unique_everseen

ARTICLE_MAPPING = {
    "FEATURED": 1,
    "RECENT": 2,
    "PUBLISHED": 3,
    "POPULAR": 4,
    "MIGHT_LIKE": 5,
    "LIKED": 6,
    "ALL": 7
}

TAG_WEIGHT_LIMIT = 7
USER_TAG_WEIGHT_LIMIT = 50


class BestMatchedArticles():
    """
    User Score and the Article score will be matched and will returns the best match
    for the user
    """

    def __init__(self, user, article_list=None):
        self.user = user
        self.article_list = article_list
        if user:
            self.all_tag_score_filter = [
                tag_rel.tag.id for tag_rel in self.user.tag_scores if tag_rel.weight >= USER_TAG_WEIGHT_LIMIT
            ]  # it contains list of all user related tag_ids that is not opted in the users interests list and carries
            # weight more than USER_TAG_WEIGHT_LIMIT
            self.all_likes = GetValuesFromCache().user_likes(user.username)
            self.all_visited = GetValuesFromCache().user_visited(user.username)
            self.all_interests = GetValuesFromCache().user_interests(user.username)
            # if above values are not available in cache then fetch it from db
            if not self.all_likes:
                self.all_likes = user.liked_content.all()
                SetValuesInCache().user_likes(user.username, self.all_likes)
            if not self.all_visited:
                self.all_visited = user.visited_content.all()
                SetValuesInCache().user_visited(user.username, self.all_visited)
            if not self.all_interests:
                self.all_interests = user.interests.all()
                SetValuesInCache().user_interests(user.username, self.all_interests)
            self.all_not_opted_interests = self.user.tag_scores
            self.selected_content = GetValuesFromCache().selected_content()
            if not self.selected_content:
                self.selected_content = ContentTagRelation.objects.filter(
                    tag_weightage__weight__gt=TAG_WEIGHT_LIMIT).prefetch_related("tag_weightage", "content")
                SetValuesInCache().selected_content(self.selected_content)

    def most_popular(self, list_of_articles):
        """
        Formula to calculate score of an article = [ (number of like ) multiplied by 0.8 ]
         + [ (number of visits) multiplied by 0.2]
        :param list_of_articles: Queryset List of articles
        :return: processed list of articles
        """
        results = []
        for article in list_of_articles:
            obj = article.meta_details
            obj.update({"score": self.calculate_score_of_article(article.likes, article.views)})
            if obj.get("score") > 0:
                results.append(obj)
        return sorted(results, key=lambda k: k.get('score'), reverse=True)  # sorting on the basis of score


    def most_popular2(self, articles_queryset):
        """
        Formula to calculate score of an article = [ (number of like ) multiplied by 0.8 ]
         + [ (number of visits) multiplied by 0.2]
        :param list_of_articles: Queryset List of articles
        :return: processed list of articles
        """
        # articles_queryset = articles_queryset.annotate(score=Concat('likes',Value(''), 'views'))
        results = []
        for article in articles_queryset:
            # Caculating and Filtering out QuerySet with Scores less than 0
            score = self.calculate_score_of_article(article.likes, article.views)
            if score > 0:
                results.append(article.id)

        return TemplateContent.objects.filter(id__in=results)  # sorting on the basis of score


    def article_you_might_like(self, list_of_articles, limit=None):
        """
        first of all excludes article that has been read by the user and likes by the user
        based on user journey and opted interests show him relevant articles
        input: QuerySet list of articles
        output: List of articles in dict format
        :return:
        """
        # if not isinstance(list_of_articles, list) or not isinstance(list_of_articles, QuerySet):
        list_of_articles = list_of_articles
        results = []
        exclude_list = list(set(
            [content for content in self.all_likes]  # all liked content
            + [content for content in self.all_visited]  # all visited_content
        ))
        for article in list_of_articles:
            if article not in exclude_list:
                try:
                    if self.user_journey_based(article) or self.user_opted_interest_based(article):
                        results.append(article.meta_details)
                        if limit and len(results) == limit:
                            return results
                except Exception as e:
                    print(e)
            else:
                pass
        return results

    def article_you_might_like2(self, articles_queryset):
        """
        first of all excludes article that has been read by the user and likes by the user
        based on user journey and opted interests show him relevant articles
        input: QuerySet list of articles
        output: List of articles in dict format
        :return:
        """
        # if not isinstance(list_of_articles, list) or not isinstance(list_of_articles, QuerySet):
        results = []
        exclude_querysets = self.all_likes| self.all_visited
        articles_queryset = articles_queryset.exclude(id__in=exclude_querysets)
        for article in articles_queryset:
            try:
                if self.user_journey_based(article) or self.user_opted_interest_based(article):
                    results.append(article.id)

            except Exception as e:
                pass

        return TemplateContent.objects.filter(id__in=results)

    def user_journey_based(self, article):
        """
        :param article: TemplateContent
        :return: Boolean Value
        """
        for content_rel in self.selected_content.filter(
                content_id=article.id,
                tag_weightage__weight__gte=TAG_WEIGHT_LIMIT
        ):  # filter out all tags that has weight greater than TAG_WEIGHT_LIMIT
            all_tagged_content = GetValuesFromCache().tagged_content(article.id)
            if not all_tagged_content:
                all_tagged_content = content_rel.tag_weightage.all().prefetch_related('tag')
                SetValuesInCache().tagged_content(article.id, all_tagged_content)
            for tagged_content in all_tagged_content:  # match all tags
                if tagged_content.tag.id in self.all_tag_score_filter:
                    return True
        return False

    def user_opted_interest_based(self, article):
        """
        User complete score will be matched
        :return: Boolean Value
        """
        for interest in self.all_interests:
            if self.selected_content.filter(
                    content_id=article.id,
                    tag_weightage__tag_id=interest.id,
                    tag_weightage__weight__gte=TAG_WEIGHT_LIMIT
            ).exists():
                return True
        return False

    def user_interest_related(self, article, interest):
        if self.selected_content.filter(
                content_id=article.id,
                tag_weightage__tag_id=interest.id,
                tag_weightage__weight__gte=TAG_WEIGHT_LIMIT
        ).exists():
            return True
        return False

    def user_score_related(self, article, interest):
        if self.all_tag_score_filter:
            if self.selected_content.filter(
                    content_id=article.id,
                    tag_weightage__tag_id=interest.id,
                    tag_weightage__weight__gte=TAG_WEIGHT_LIMIT
            ).exists():
                return True
        return False

    def calculate_score_of_article(self, likes, views):
        # use filter to calculate the score of an article in a loop
        likes = likes if likes else 0
        views = views if views else 0
        return sum([(mul(int(likes), 0.8)), (mul(int(views), 0.2))])



class NewsListing(object):
        """
        All News lists available from this class
        """

        def __init__(self, user=None, mapping_id=None, user_related=None, limit=None):
            self.limit = limit
            self.user = user
            self.map_id = mapping_id

            self.all_published = TemplateContent.objects.all_published()  # Only called once  # Query 1
            if user:
                self.best_matched = BestMatchedArticles(user)  # composition of BestMatched article class
                self.all_interests = GetValuesFromCache().user_interests(self.user.username)
                if not self.all_interests:  # QUERY 2
                    self.all_interests = self.user.interests.all()
                    SetValuesInCache().user_interests(self.user.username, self.all_interests)
            # Individual section's article
            self.article_mapper = {
                ARTICLE_MAPPING["RECENT"]: 'self.recent',  # recently published
                ARTICLE_MAPPING["LIKED"]: 'self.liked_articles',
                ARTICLE_MAPPING["MIGHT_LIKE"]: 'self.articles_might_like',
                ARTICLE_MAPPING["POPULAR"]: 'self.most_popular',
            }
            if not user_related:
                # Get particular section's article
                self.content_mapping = {
                    ARTICLE_MAPPING["RECENT"]: 'self.recent',  # recently published
                    # ARTICLE_MAPPING["LIKED"]: 'self.liked_articles',
                    ARTICLE_MAPPING["MIGHT_LIKE"]: 'self.articles_might_like',
                    ARTICLE_MAPPING["POPULAR"]: 'self.most_popular',
                }
            else:
                self.interest = Tag.objects.get(id=int(self.map_id))
            self.data = {}

        @property
        def get_news(self):
            self.data = {
                "featured": {"id": ARTICLE_MAPPING["FEATURED"], "articles": self.featured},
                "recently_added": {"id": ARTICLE_MAPPING["RECENT"], "articles": []},
                "most_popular": {"id": ARTICLE_MAPPING["POPULAR"], "articles": []},

            }
            self.thread_pooling()
            return self.data

        @property
        def get_user_related(self):
            self.data = {
                "user_related_articles": [],
                "articles_might_like": {"id": ARTICLE_MAPPING["MIGHT_LIKE"], "articles": []},
                "articles_liked": {"id": ARTICLE_MAPPING["LIKED"], "articles": []},
            }

            self.user_thread_pool()
            return self.data

        def thread_pooling(self):
            # first API call
            with concurrent.futures.ThreadPoolExecutor() as executor:
                executor.submit(self.recent)
                executor.submit(self.most_popular)
                if self.user:
                    executor.submit(self.liked_articles)

        def user_thread_pool(self):
            with concurrent.futures.ThreadPoolExecutor() as executor:
                if self.user:
                    executor.submit(self.articles_might_like)
                    executor.submit(self.user_recommendations)
                    executor.submit(self.liked_articles)

        def recent(self):
            articles = TemplateContent.objects.recent_articles()
            return [] if not articles else {"name": "recently added articles", "articles": articles}

        def most_popular(self):
            articles = GetValuesFromCache().most_popular()
            if not articles:
                try:
                    articles = BestMatchedArticles(user=None).most_popular(self.all_published)
                except Exception as  e:
                    print(e)
                SetValuesInCache().set_most_popular(articles)
            if len(articles) >= 3:
                if self.map_id:
                    return [] if not articles else {"name": "most popular", "articles": articles}
                else:
                    self.data.get("most_popular")["articles"] += articles

        def articles_might_like(self):
            if self.user:
                articles = GetValuesFromCache().articles_might_like(self.user.username)
                if not articles:
                    if self.limit:
                        return self.best_matched.article_you_might_like(self.all_published, limit=self.limit)
                    articles = self.best_matched.article_you_might_like(self.all_published)
                    SetValuesInCache().set_articles_might_like(self.user.username, articles)
                if len(articles) >= 3:
                    if self.limit:
                        return articles[:self.limit]
                    if self.map_id:
                        return [] if not articles else {"name": "articles you might like", "articles": articles}
                    else:
                        self.data.get("articles_might_like")["articles"] += articles
            else:
                return []

        def liked_articles(self):
            if self.user:
                all_articles = GetValuesFromCache().liked_articles(self.user.username)  # Cached Articles
                if not all_articles:
                    # all_articles = self.user.liked_content.all() #  fetch liked articles

                    all_articles = TemplateContent.objects.filter(content_liked__id=self.user.id).order_by(
                        '-content_publish_date')

                    SetValuesInCache().set_user_liked_content(self.user.username, all_articles)
                if len(all_articles) >= 3:
                    articles = [article.meta_details for article in all_articles]
                    # articles = [article.meta_details.order_by('-article_publish_date') for article in all_articles]
                    if self.map_id:
                        return [] if not articles else {"name": "articles you've liked in past", "articles": articles}
                    else:
                        self.data.get("articles_liked")["articles"] += articles
            else:
                return {"name": "articles you've liked in past", "articles": []}

        def user_recommendations(self):
            with concurrent.futures.ThreadPoolExecutor() as executor:
                executor.submit(self.user_related)
                executor.submit(self.user_interest_related)

        def user_related(self):  # for all interest related articles
            all_articles = GetValuesFromCache().get_user_related(self.user.username)
            if not all_articles:
                all_articles = []
                for interest in self.user.user_score_interest_based:  # Returns Tag relation of user with score
                    if interest["weight"] >= USER_TAG_WEIGHT_LIMIT:
                        if interest["tag"] not in self.all_interests:
                            obj = {"name": interest["tag"].name, "id": interest["tag"].id, "articles": []}
                            for article in self.all_published:
                                try:  # USER JOURNEY SCORE MATCHING
                                    if self.best_matched.user_interest_related(
                                            article, interest["tag"]
                                    ):
                                        obj["articles"].append(article.meta_details)
                                except Exception as e:
                                    pass
                            if len(obj["articles"]) > 3:
                                all_articles.append(obj)
                                self.data.get("user_related_articles").append(obj)
                SetValuesInCache().set_user_related(self.user.username, all_articles)
            else:
                self.data["user_related_articles"] += all_articles

        def user_interest_related(self):
            all_articles = GetValuesFromCache().get_user_interest_based(self.user.username)
            if not all_articles:
                all_articles = []
                for interest in self.all_interests:
                    obj = {"name": interest.name, "id": interest.id, "articles": []}
                    for article in self.all_published:
                        if self.best_matched.user_interest_related(article=article, interest=interest):
                            obj["articles"].append(article.meta_details)
                    if len(obj["articles"]) > 3:
                        all_articles.append(obj)
                        self.data.get("user_related_articles").append(obj)
                SetValuesInCache().set_user_interest_based(self.user.username, all_articles)
            else:
                self.data["user_related_articles"] += all_articles

        def respective_article(self):
            data = eval(self.article_mapper[self.map_id])()
            return data

        def particular(self):
            obj = {}
            for interest in self.all_interests.filter(id=self.map_id):
                obj = {"name": interest.name, "id": interest.id, "articles": []}
                for content in ContentTagRelation.objects.filter(
                        tag_weightage__tag=interest, tag_weightage__weight__gte=7
                ).order_by('tag_weightage__weight'):
                    obj["articles"].append(content.content.meta_details)
            return obj

        def particular_interest(self):
            article_list = []
            obj = {"name": "because you like " + self.interest.name, "id": self.interest.id, "articles": []}
            for article in self.all_published:
                if self.interest in self.all_interests:
                    if self.best_matched.user_interest_related(article=article, interest=self.interest):
                        if article not in article_list:  # For duplication
                            article_list.append(article)
                            obj["articles"].append(article.meta_details)
                else:
                    try:
                        if self.user.tag_scores.get(
                                id=self.interest.id).weight >= USER_TAG_WEIGHT_LIMIT and self.best_matched.user_score_related(
                            article,
                            self.interest):
                            if article not in article_list:
                                article_list.append(article)
                                obj["articles"].append(article.meta_details)
                    except Exception as e:
                        pass
            return obj

        @property
        def featured(self):
            featured = GetValuesFromCache().featured_article()
            if not featured:
                featured = TemplateContent.objects.get_featured()  # Featured will have single record
                SetValuesInCache().set_featured(featured)
            if self.user:
                self.all_likes = GetValuesFromCache().user_likes(self.user.username)
                if not self.all_likes:
                    self.all_likes = self.user.liked_content.all()
                    SetValuesInCache().user_likes(self.user.username, self.all_likes)
                featured.update({"is_liked": True if featured["content_id"] in [
                    content.id for content in self.all_likes
                ] else False})
                featured.update({"is_disliked": True if featured["content_id"] in [
                    content.id for content in self.user.blacklist.all()
                ] else False})
            return featured

        @property
        def get_user_like_based(self):
            return


class NewsListing2(object):
    """
    All News lists available from this class
    """

    def __init__(self, user=None, mapping_id=None, user_related=None, limit=None, start_index=0, end_index =10000):
        self.limit = limit
        self.user = user
        self.map_id = mapping_id
        self.start_index = start_index
        self.end_index = end_index

        self.all_published = GetValuesFromCache().published_content()
        if not self.all_published:
            self.all_published = TemplateContent.objects.all_published() # Only called once  # Query 1
            SetValuesInCache().set_published_content(self.all_published)

        if user:
            self.best_matched = BestMatchedArticles(user)  # composition of BestMatched article class
            self.all_interests = GetValuesFromCache().user_interests(self.user.username)
            if not self.all_interests:  # QUERY 2
                self.all_interests = self.user.interests.all()
                SetValuesInCache().user_interests(self.user.username, self.all_interests)
        # Individual section's article
        self.article_mapper = {
            ARTICLE_MAPPING["RECENT"]: 'self.recent',  # 2 recently published
            ARTICLE_MAPPING["LIKED"]: 'self.liked_articles', #6
            ARTICLE_MAPPING["MIGHT_LIKE"]: 'self.articles_might_like', #5
            ARTICLE_MAPPING["POPULAR"]: 'self.most_popular', #4
        }
        if not user_related:
            # Get particular section's article
            self.content_mapping = {
                ARTICLE_MAPPING["RECENT"]: 'self.recent',  # recently published
                # ARTICLE_MAPPING["LIKED"]: 'self.liked_articles',
                ARTICLE_MAPPING["MIGHT_LIKE"]: 'self.articles_might_like',
                ARTICLE_MAPPING["POPULAR"]: 'self.most_popular',
            }
        else:
            try:
                self.interest = Tag.objects.get(id=int(self.map_id))
            except Tag.DoesNotExist:
                raise APIException("Invalid Mapping Id")

        self.data = {}

    @property
    def get_news(self):
        self.data = {
            "featured": {"id": ARTICLE_MAPPING["FEATURED"], "articles": self.featured},
            "recently_added": {"id": ARTICLE_MAPPING["RECENT"], "articles": []},
            "most_popular": {"id": ARTICLE_MAPPING["POPULAR"], "articles": []},

        }
        self.thread_pooling()
        return self.data

    @property
    def get_user_related(self):
        self.data = {
            "user_related_articles": [],
            "articles_might_like": {"id": ARTICLE_MAPPING["MIGHT_LIKE"], "articles": []},
            "articles_liked": {"id": ARTICLE_MAPPING["LIKED"], "articles": []},
        }

        self.user_thread_pool()
        return self.data

    def thread_pooling(self):
        # first API call
        with concurrent.futures.ThreadPoolExecutor() as executor:
            executor.submit(self.recent)
            executor.submit(self.most_popular)
            if self.user:
                executor.submit(self.liked_articles)

    def user_thread_pool(self):
        with concurrent.futures.ThreadPoolExecutor() as executor:
            if self.user:
                executor.submit(self.articles_might_like)
                executor.submit(self.user_recommendations)
                executor.submit(self.liked_articles)

    def recent(self):
        articles, total_count = TemplateContent.objects.recent_articles2(self.start_index, self.end_index)
        return {"name": "recently added articles", "articles": articles, "total_count": total_count}

    def most_popular(self):
        articles = GetValuesFromCache().most_popular()
        if not articles:
            try:
                articles = BestMatchedArticles(user=None).most_popular(self.all_published)
            except Exception as  e:
                print(e)
            SetValuesInCache().set_most_popular(articles)
        total_count = len(articles)
        articles = articles[self.start_index:self.end_index]
        return {"name": "most popular", "articles": articles, "total_count": total_count}

    def articles_might_like(self):
        if self.user:
            articles = GetValuesFromCache().articles_might_like(self.user.username)
            if not articles:
                if self.limit:
                    return self.best_matched.article_you_might_like(self.all_published, limit=self.limit)
                articles = self.best_matched.article_you_might_like(self.all_published)
                SetValuesInCache().set_articles_might_like(self.user.username, articles)
            total_count = len(articles)
            articles = articles[self.start_index:self.end_index]
            return {"name": "articles you might like", "articles": articles, "total_count": total_count}


    def liked_articles(self):
        if self.user:
            all_articles = GetValuesFromCache().liked_articles(self.user.username)  # Cached Articles
            if not all_articles:
                all_articles = TemplateContent.objects.filter(content_liked__id=self.user.id).order_by('-content_publish_date')

                SetValuesInCache().set_user_liked_content(self.user.username, all_articles)
            total_count = len(all_articles)
            all_articles = all_articles[self.start_index:self.end_index]
            articles = [article.meta_details for article in all_articles]
            return  {"name": "articles you've liked in past", "articles": articles, "total_count": total_count}

        else:
            return {"name": "articles you've liked in past", "articles": []}

    def user_recommendations(self):
        with concurrent.futures.ThreadPoolExecutor() as executor:
            executor.submit(self.user_related)
            executor.submit(self.user_interest_related)

    def user_related(self):  # for all interest related articles
        all_articles = GetValuesFromCache().get_user_related(self.user.username)
        if not all_articles:
            all_articles = []
            for interest in self.user.user_score_interest_based:  # Returns Tag relation of user with score
                if interest["weight"] >= USER_TAG_WEIGHT_LIMIT:
                    if interest["tag"] not in self.all_interests:
                        obj = {"name": interest["tag"].name, "id": interest["tag"].id, "articles": []}
                        for article in self.all_published:
                            try:  # USER JOURNEY SCORE MATCHING
                                if self.best_matched.user_interest_related(
                                        article, interest["tag"]
                                ):
                                    obj["articles"].append(article.meta_details)
                            except Exception as e:
                                pass
                        if len(obj["articles"]) > 3:
                            all_articles.append(obj)
                            self.data.get("user_related_articles").append(obj)
            SetValuesInCache().set_user_related(self.user.username, all_articles)
        else:
            self.data["user_related_articles"] += all_articles

    def user_interest_related(self):
        all_articles = GetValuesFromCache().get_user_interest_based(self.user.username)
        if not all_articles:
            all_articles = []
            for interest in self.all_interests:
                obj = {"name": interest.name, "id": interest.id, "articles": []}
                for article in self.all_published:
                    if self.best_matched.user_interest_related(article=article, interest=interest):
                        obj["articles"].append(article.meta_details)
                if len(obj["articles"]) > 3:
                    all_articles.append(obj)
                    self.data.get("user_related_articles").append(obj)
            SetValuesInCache().set_user_interest_based(self.user.username, all_articles)
        else:
            self.data["user_related_articles"] += all_articles

    def respective_article(self):
        if self.map_id not in self.article_mapper:
            raise APIException("Invalid Mapping Id")

        data = eval(self.article_mapper[self.map_id])()
        return data

    def particular(self):
        obj = {}
        for interest in self.all_interests.filter(id=self.map_id):
            obj = {"name": interest.name, "id": interest.id, "articles": []}
            for content in ContentTagRelation.objects.filter(
                    tag_weightage__tag=interest, tag_weightage__weight__gte=7
            ).order_by('tag_weightage__weight'):
                obj["articles"].append(content.content.meta_details)
        return obj

    def particular_interest(self):
        article_list = []
        obj = {"name": "because you like " + self.interest.name, "articles": []}
        cached_arts = GetValuesFromCache().articles_interest_based(self.interest.id)
        if cached_arts:
            obj['total_count'] = len(cached_arts)
            cached_arts = cached_arts[self.start_index:self.end_index]
            obj['articles'] = cached_arts
            return obj

        for article in self.all_published:
            if self.interest in self.all_interests:
                if self.best_matched.user_interest_related(article=article, interest=self.interest):
                    if article not in article_list:  # For duplication
                        article_list.append(article)
                        obj["articles"].append(article.meta_details)
            else:
                try:
                    if self.user.tag_scores.get(
                            id=self.interest.id).weight >= USER_TAG_WEIGHT_LIMIT and self.best_matched.user_score_related(
                        article,
                        self.interest):
                        if article not in article_list:
                            article_list.append(article)
                            obj["articles"].append(article.meta_details)
                except Exception as e:
                    pass

        SetValuesInCache().set_article_interest_based(self.interest.id, obj["articles"])
        obj['total_count'] = len(obj['articles'])
        obj['articles'] = obj['articles'][self.start_index:self.end_index]
        return obj

    @property
    def get_featured(self):
        self.data = {
            "featured": {"id": ARTICLE_MAPPING["FEATURED"], "articles": self.featured},
        }
        return self.data

    @property
    def featured(self):
        featured = GetValuesFromCache().featured_article()
        if not featured:
            featured = TemplateContent.objects.get_featured()  # Featured will have single record
            SetValuesInCache().set_featured(featured)
        if self.user:
            self.all_likes = GetValuesFromCache().user_likes(self.user.username)
            if not self.all_likes:
                self.all_likes = self.user.liked_content.all()
                SetValuesInCache().user_likes(self.user.username, self.all_likes)
            featured.update({"is_liked": True if featured["content_id"] in [
                content.id for content in self.all_likes
            ] else False})
            featured.update({"is_disliked": True if featured["content_id"] in [
                content.id for content in self.user.blacklist.all()
            ] else False})
        return featured

    @property
    def get_user_like_based(self):
        return



class NewNewsListing(object):
    """
    All News lists available from this class
    No Cache is and should be used in This function
    """

    def __init__(self,  mapping_id, user=None, user_related=None, start_index=0, end_index =10000):
        self.user = user
        self.map_id = mapping_id
        self.start_index = start_index
        self.end_index = end_index
        self.data = {}

        self.all_published2 = TemplateContent.objects.all_published2() # Only called once  # Query 1

        if user:
            self.best_matched = BestMatchedArticles(user)  # composition of BestMatched article class
            self.all_interests = self.user.interests.all()

        # self.get_map_func()

        if user_related:
            try:
                self.interest = Tag.objects.get(id=int(self.map_id))
            except Tag.DoesNotExist:
                raise APIException("Invalid Mapping Id")

        else:
            self.get_user_map_func()



    def get_map_func(self):
        article_mapper = {
            ARTICLE_MAPPING["RECENT"]: 'self.recent',  # 2 recently published
            ARTICLE_MAPPING["LIKED"]: 'self.liked_articles',  # 6
            ARTICLE_MAPPING["MIGHT_LIKE"]: 'self.articles_might_like',  # 5
            ARTICLE_MAPPING["POPULAR"]: 'self.most_popular',  # 4
        }
        try:
            return eval(article_mapper[int(self.map_id)])()
        except:
            raise APIException("Invalid Mapping Id")



    def get_user_map_func(self):
        self.content_mapping = {
            ARTICLE_MAPPING["RECENT"]: 'self.recent',  # recently published
            ARTICLE_MAPPING["MIGHT_LIKE"]: 'self.articles_might_like',
            ARTICLE_MAPPING["POPULAR"]: 'self.most_popular',
        }



    @property
    def get_news(self):
        self.data = {
            "featured": {"id": ARTICLE_MAPPING["FEATURED"], "articles": self.featured},
            "recently_added": {"id": ARTICLE_MAPPING["RECENT"], "articles": []},
            "most_popular": {"id": ARTICLE_MAPPING["POPULAR"], "articles": []},

        }
        self.thread_pooling()
        return self.data

    @property
    def get_user_related(self):
        self.data = {
            "user_related_articles": [],
            "articles_might_like": {"id": ARTICLE_MAPPING["MIGHT_LIKE"], "articles": []},
            "articles_liked": {"id": ARTICLE_MAPPING["LIKED"], "articles": []},
        }

        self.user_thread_pool()
        return self.data

    def thread_pooling(self):
        # first API call
        with concurrent.futures.ThreadPoolExecutor() as executor:
            executor.submit(self.recent)
            executor.submit(self.most_popular)
            if self.user:
                executor.submit(self.liked_articles)

    def user_thread_pool(self):
        with concurrent.futures.ThreadPoolExecutor() as executor:
            if self.user:
                executor.submit(self.articles_might_like)
                executor.submit(self.user_recommendations)
                executor.submit(self.liked_articles)

    def recent(self):
        return self.all_published2


    def most_popular(self):
        try:
            articles = BestMatchedArticles(user=None).most_popular2(self.all_published2)
        except Exception:
            articles = TemplateContent.objects.none()

        return articles

    def articles_might_like(self):

        if self.user:
            return self.best_matched.article_you_might_like2(self.all_published2)

        # Return Empty QuerySet is User is Not Present
        return TemplateContent.objects.none()

    def liked_articles(self):
        if self.user:
            return TemplateContent.objects.filter(content_liked__id=self.user.id).order_by('-content_publish_date')
        # Return Empty QuerySet is User is Not Present
        return TemplateContent.objects.none()

    def user_recommendations(self):
        with concurrent.futures.ThreadPoolExecutor() as executor:
            executor.submit(self.user_related)
            executor.submit(self.user_interest_related)

    def user_related(self):  # for all interest related articles
        all_articles = GetValuesFromCache().get_user_related(self.user.username)
        if not all_articles:
            all_articles = []
            for interest in self.user.user_score_interest_based:  # Returns Tag relation of user with score
                if interest["weight"] >= USER_TAG_WEIGHT_LIMIT:
                    if interest["tag"] not in self.all_interests:
                        obj = {"name": interest["tag"].name, "id": interest["tag"].id, "articles": []}
                        for article in self.all_published2:
                            try:  # USER JOURNEY SCORE MATCHING
                                if self.best_matched.user_interest_related(
                                        article, interest["tag"]
                                ):
                                    obj["articles"].append(article.meta_details)
                            except Exception as e:
                                pass
                        if len(obj["articles"]) > 3:
                            all_articles.append(obj)
                            self.data.get("user_related_articles").append(obj)
            SetValuesInCache().set_user_related(self.user.username, all_articles)
        else:
            self.data["user_related_articles"] += all_articles

    def user_interest_related(self):
        all_articles = GetValuesFromCache().get_user_interest_based(self.user.username)
        if not all_articles:
            all_articles = []
            for interest in self.all_interests:
                obj = {"name": interest.name, "id": interest.id, "articles": []}
                for article in self.all_published2:
                    if self.best_matched.user_interest_related(article=article, interest=interest):
                        obj["articles"].append(article.meta_details)
                if len(obj["articles"]) > 3:
                    all_articles.append(obj)
                    self.data.get("user_related_articles").append(obj)
            SetValuesInCache().set_user_interest_based(self.user.username, all_articles)
        else:
            self.data["user_related_articles"] += all_articles

    # def respective_article(self):
    #     if self.map_id not in self.article_mapper:
    #         raise APIException("Invalid Mapping Id")
    #
    #     data = eval(self.article_mapper[self.map_id])()
    #     return data

    def particular(self):
        obj = {}
        for interest in self.all_interests.filter(id=self.map_id):
            obj = {"name": interest.name, "id": interest.id, "articles": []}
            for content in ContentTagRelation.objects.filter(
                    tag_weightage__tag=interest, tag_weightage__weight__gte=7
            ).order_by('tag_weightage__weight'):
                obj["articles"].append(content.content.meta_details)
        return obj

    def particular_interest(self):
        article_list = []

        for article in self.all_published2:
            if self.interest in self.all_interests:
                if self.best_matched.user_interest_related(article=article, interest=self.interest):
                    if article.id not in article_list:  # For duplication
                        article_list.append(article.id)
            else:
                try:
                    if self.user.tag_scores.get(
                            tag_id=self.interest.id).weight >= USER_TAG_WEIGHT_LIMIT and self.best_matched.user_score_related(
                        article, self.interest):

                        if article.id not in article_list:
                            article_list.append(article.id)

                except Exception as e:
                    pass

        article_set = set(article_list)
        return TemplateContent.objects.filter(id__in=article_set).order_by('-content_publish_date')

    @property
    def get_featured(self):
        self.data = {
            "featured": {"id": ARTICLE_MAPPING["FEATURED"], "articles": self.featured},
        }
        return self.data

    @property
    def featured(self):
        featured = GetValuesFromCache().featured_article()
        if not featured:
            featured = TemplateContent.objects.get_featured()  # Featured will have single record
            SetValuesInCache().set_featured(featured)
        if self.user:
            self.all_likes = GetValuesFromCache().user_likes(self.user.username)
            if not self.all_likes:
                self.all_likes = self.user.liked_content.all()
                SetValuesInCache().user_likes(self.user.username, self.all_likes)
            featured.update({"is_liked": True if featured["content_id"] in [
                content.id for content in self.all_likes
            ] else False})
            featured.update({"is_disliked": True if featured["content_id"] in [
                content.id for content in self.user.blacklist.all()
            ] else False})
        return featured

    @property
    def get_user_like_based(self):
        return


class SearchWithKeyWord(object):
    """
    Keyword Search for an article
    """

    def __init__(self, keyword, start_index=0, end_index=12):
        self.keyword = keyword
        self.start_index = start_index
        self.end_index = end_index
        self.all_published = TemplateContent.objects.all_published()
        self.process_text()

    def process_text(self):
        if self.keyword:
            self.processed_text = self.keyword.split(" ")
        else:
            self.keyword = None

    def search(self):
        result_set = []
        results = []
        if self.keyword:
            if len(self.processed_text) > 1:
                results += [
                    content.meta_details for content in
                    self.all_published.filter(
                        Q(content_heading__contains=self.keyword) |
                        Q(content_heading__contains=self.keyword.upper()) |
                        Q(content_heading__contains=self.keyword.lower()) |
                        Q(content_heading__contains=self.keyword.title())

                    )]

            for each_keyword in self.processed_text:
                results += [
                    content.meta_details for content in
                    self.all_published.filter(
                        Q(content_heading__contains=each_keyword) |
                        Q(content_heading__contains=each_keyword.upper()) |
                        Q(content_heading__contains=each_keyword.lower()) |
                        Q(content_heading__contains=each_keyword.title())

                    )]

            if len(self.processed_text) > 1:
                results += [
                    content.meta_details for content in
                    self.all_published.filter(
                        Q(content_body__contains=self.keyword) |
                        Q(content_body__contains=self.keyword.upper()) |
                        Q(content_body__contains=self.keyword.lower()) |
                        Q(content_body__contains=self.keyword.title())

                    )]

            for each_keyword in self.processed_text:
                results += [
                    content.meta_details for content in
                    self.all_published.filter(
                        Q(content_body__contains=each_keyword) |
                        Q(content_body__contains=each_keyword.upper()) |
                        Q(content_body__contains=each_keyword.lower()) |
                        Q(content_body__contains=each_keyword.title())

                    )]
            result_set = []
            for dataset in results:
                if dataset not in result_set:
                    result_set.append(dataset)


                # results = list(unique_everseen(results))

        return result_set



class NewSearchWithKeyWord(object):
    """
    Keyword Search for an article
    """

    def __init__(self, keyword):
        self.keyword = keyword
        self.all_published = TemplateContent.objects.all_published()
        self.process_text()

    def process_text(self):
        if self.keyword:
            self.processed_text = self.keyword.split(" ")
        else:
            self.keyword = None

    def search(self):
        qY = Q()
        qN = Q()

        good_heading_maches = []
        good_body_maches = []

        if not self.keyword:
            return self.all_published

        perfect_heading_maches = self.all_published.filter(content_heading__icontains=self.keyword)
        perfect_body_maches = self.all_published.filter(Q(content_body__icontains=self.keyword) & ~Q(content_heading__icontains=self.keyword))

        if len(self.processed_text) > 1:
            for each_keyword in self.processed_text:
                qY |= Q(content_heading__icontains=each_keyword) & ~Q(content_heading__icontains=self.keyword)
                qN |= Q(content_body__icontains=each_keyword) & ~Q(content_body__icontains=self.keyword)

            good_heading_maches = self.all_published.filter(qY)
            good_body_maches = self.all_published.filter(qN)


        head = list(perfect_heading_maches) + list(good_heading_maches)
        body = list(perfect_body_maches) + list(good_body_maches)
        return head + body



def checkarticlefilter(article_filter):
    if (article_filter is None or len(article_filter) == 0 or article_filter == "" ):
        return True
    else:
        return False