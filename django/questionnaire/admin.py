from django.contrib import admin

# Register your models here.
from questionnaire.models import Question, Option


class OptionAdmin(admin.ModelAdmin):
    """
    Fields exclude at admin panel
    """
    list_display = ('id', 'text','image_img',)
    exclude = ('guid',)
    search_fields = ('id','text',)


class QuestionAdmin(admin.ModelAdmin):
    """
    Fields exclude at admin panel
    """
    list_display = ('id', 'question_text','question_type','next_question','is_first_question',)
    exclude = ('guid',)
    search_fields = ('id', 'question_text','question_type','next_question__question_text',)

admin.site.register(Question, QuestionAdmin)
admin.site.register(Option, OptionAdmin)
