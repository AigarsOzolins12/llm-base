from django.db import models
from django.db.models import CharField, ForeignKey

class ChatState(models.Model):
    user_id = CharField()
    
    
class ChatMessage(models.Model):
    role: CharField = CharField(10)
    content: CharField = CharField()
    chat_state = ForeignKey(ChatState, on_delete=models.CASCADE, related_name='messages')
